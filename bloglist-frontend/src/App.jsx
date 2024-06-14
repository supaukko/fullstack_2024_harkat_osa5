import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Login from './components/Login'
import User from './components/User'
import Togglable from './components/Togglable'
import {USER_STORAGE_KEY} from './config/constants'

const defaultBlogData = {
  author: '',
  title: '',
  url: '',
  votes: 0,
  id: null
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogData, setBlogData] = useState({...defaultBlogData});
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  /**
   * useRef hookilla luodaan ref blogFormRef, joka kiinnitetään muistiinpanojen
   * luomislomakkeen sisältävälle Togglable-komponentille.
   * Nyt siis muuttuja blogFormRef toimii viitteenä komponenttiin
   */
  const blogFormRef = useRef()

  const style = {
    notification: 'notification',
    error: 'error'
  }

  /**
   * Blogilistan lataus
   */
  useEffect(() => {
    const fetchData = async () => {
      await blogService.getAll().then(blogs => {
        setBlogs(blogs)
      })
    }
    fetchData()
  }, [])

  /**
   * Tarkistetaan onko kirjautunut käyttäjä
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(USER_STORAGE_KEY)
    if (loggedUserJSON) {
      const usr = JSON.parse(loggedUserJSON)
      setUser(usr)
      console.log('useEffect', usr)
      blogService.setToken(usr.token)
    }
  }, [])

  const filteredBlogs = blogs?.filter(blog =>
    blog.author?.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));

  const handleLogout = () => {
    setUser(null)
    loginService.logout()
  }

  /**
   * Handle login
   * @param {*} event 
   */
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const usr = await loginService.login({username, password})
      window.localStorage.setItem(
        USER_STORAGE_KEY, JSON.stringify(usr)
      ) 
      blogService.setToken(usr.token)
      setUser(usr)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password', style.error)
    }
  }

  /**
   * Handle change 
   * @param {*} event 
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogData({
      ...blogData,
      [name]: value
    });
  }

  /**
   * Clear blog data 
   */
  const handleClear = (event) => {
    console.log('handleClear..')
    event.preventDefault()
    setBlogData({...defaultBlogData});
  }

    /**
   * handleRowSelect
   * @param {*} blog
   */
  const handleRowSelect = (blog) => {
    console.log('handleRowSelect', blog)
    setBlogData({...blog});
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  /**
   * Parse error msg
   * @param {*} error 
   * @returns 
   */
  const parseErrorMsg = (error) => {
    const msg = error.response.data.error;
    return msg != null && msg.length > 0 ? msg : error.message
  }

  /**
   * Handle the addition of a new blog or the update of an old blog
   * @param {*} event 
   */
  const handleSubmitBlog = async (event) => {
    event.preventDefault()
    if (blogData.id !== null || blogData.id?.trim() === '') {
      await doUpdate()
    }
    else {
      await doAdd()
    }
  }

  /**
   * Add a new blog
   */
  const doAdd = async () => {
    try {
      const returnedBlog = await blogService.create(blogData)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        style.notification)
      setBlogData({...defaultBlogData});
    }
    catch(error) {
      showNotification(parseErrorMsg(error), style.error)
    }
  }

  /**
   * Update a blog
   */
  const doUpdate = async () => {
    console.log('doUpdate', blogData)
    try {
      const returnedBlog = await blogService.update(blogData.id, blogData)
      setBlogs(blogs.map(blog => (blog.id === blogData.id ? {...blogData} : blog)))
      showNotification(`Updated ${returnedBlog.author}`, style.notification)
      setBlogData({...defaultBlogData});
    }
    catch(error) {
      showNotification(parseErrorMsg(error), style.error)
    }
  }

  const showNotification = (msg, style) => {
    setNotificationStyle(style)
    setNotificationMessage(msg)

    setTimeout(() => {
      setNotificationStyle(null)
      setNotificationMessage(null)
    }, 5000)
  }

  /**
   * Handle delete
   * @param {*} id 
   */
  const handleDelete = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Delete ${blog.title} ?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        showNotification(`Deleted ${blog.title}`, style.notification)
      }
      catch(error) {
        showNotification(parseErrorMsg(error), style.error)
      }
    }
  }

  if (filteredBlogs === null) {
    return null
  }

  return (
    <div>
      <Notification message={notificationMessage} style={notificationStyle} />
      <h2>blogs</h2>
      <User user={user} handleLogout={handleLogout} />
        { !user &&
          <Login
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin} />
        }
        <div>
          { user && 
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
              <BlogForm
                blogData={blogData}
                handleSubmit={handleSubmitBlog}
                handleChange={handleChange} 
                handleClear={handleClear} />
            </Togglable>
          }
          <h2>Blogit</h2>
          <Filter filter={filter} handleChange={handleFilterChange} />
          <Blogs
            user={user}
            blogs={filteredBlogs}
            handleDelete={handleDelete}
            blogData={blogData}
            handleRowSelect={handleRowSelect} />
        </div>
    </div>
  )
}

export default App