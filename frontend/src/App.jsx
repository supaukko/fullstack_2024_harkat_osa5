import { useState, useEffect } from 'react'
import blogService from './services/blog'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Blogs from './components/Blogs'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Login from './components/Login'
import User from './components/User'
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
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const filteredBlogs = blogs?.filter(blog =>
    blog.author?.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()));

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
      showNotification('Wrong credentials', style.error)
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
      showNotification(`Added ${returnedBlog.author}`, style.notification)
      setBlogData({...defaultBlogData});
    }
    catch(error) {
      const msg = error.response.data.error;
      showNotification(msg !== null && msg.length > 0 ?
        msg : error.message, style.error)
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
      const msg = error.response.data.error;
      showNotification(msg !== null && msg.length > 0 ?
        msg : error.message, style.error)
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
      await blogService.remove(id)
      setBlogs(blogs.filter(b => b.id !== id))
      showNotification(`Deleted ${blog.title}`, style.notification)
    }
  }

  if (filteredBlogs === null) {
    return null
  }

  return (
    <div>
      <Notification message={notificationMessage} style={notificationStyle} />
      <User user={user} />
      <h2>Blogilista</h2>
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
            <BlogForm
              blogData={blogData}
              handleSubmit={handleSubmitBlog}
              handleChange={handleChange} 
              handleClear={handleClear} />
          }
          <h2>Blogit</h2>
          <Filter filter={filter} handleChange={handleFilterChange} />
          <Blogs
            blogs={filteredBlogs}
            handleDelete={handleDelete}
            blogData={blogData}
            handleRowSelect={handleRowSelect} />
        </div>
    </div>
  )
}

export default App