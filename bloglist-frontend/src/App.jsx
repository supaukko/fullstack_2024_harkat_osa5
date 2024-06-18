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
import { USER_STORAGE_KEY } from './config/constants'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState(null)
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

  /**
   * Filter
   * @param {*} event
   */
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  /**
   * Filter based on authors. The list is descending sorted
   * according to the likes/votes
   */
  const filteredBlogs = blogs?.filter(blog =>
    blog.title?.toLocaleLowerCase().includes(filter?.toLocaleLowerCase()))
    .sort((blog1, blog2) => blog2.votes - blog1.votes)

  const handleLogin = async (username, password) => {
    try {
      const usr = await loginService.login({ username, password })
      window.localStorage.setItem(
        USER_STORAGE_KEY, JSON.stringify(usr)
      )
      blogService.setToken(usr.token)
      setUser(usr)
    } catch (exception) {
      showNotification('wrong username or password', style.error)
    }
  }

  /**
   * Logout
   */
  const handleLogout = () => {
    setUser(null)
    loginService.logout()
  }

  /**
   * Parse error msg
   * @param {*} error
   * @returns
   */
  const parseErrorMsg = (error) => {
    const msg = error.response?.data?.error
    return msg !== null && msg !== undefined
      && msg.length > 0 ? msg : error.message
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
   * Add a new blog
   */
  const handleAddBlog = async (data) => {
    try {
      console.log('handleAddBlog', data)
      const returnedBlog = await blogService.create(data)
      setBlogs(blogs.concat(returnedBlog))
      if (blogFormRef.current) {
        blogFormRef.current.toggleVisibility()
      }
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        style.notification)
    }
    catch(error) {
      showNotification(parseErrorMsg(error), style.error)
    }
  }

  /**
   * Update a blog
   */
  const handleUpdateBlog = async (data) => {
    console.log('handleUpdateBlog', data)
    try {
      const returnedBlog = await blogService.update(data.id, data)
      setBlogs(blogs.map(blog => (blog.id === returnedBlog.id ? { ...returnedBlog } : blog)))
      showNotification(`Updated ${returnedBlog.author}`, style.notification)
    }
    catch(error) {
      showNotification(parseErrorMsg(error), style.error)
    }
  }

  /**
   * Handle delete
   * @param {*} id
   */
  const handleDeleteBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    console.log('handleDeleteBlog', blog)
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        showNotification(`The blog '${blog.title}' has been removed`, style.notification)
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
          <Login handleLogin={handleLogin} />
      }
      <div>
        { user &&
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
              <BlogForm handleAddBlog={handleAddBlog} />
            </Togglable>
        }
        <h2>Blogit</h2>
        <Filter filter={filter} handleChange={handleFilterChange} />
        <Blogs
          blogs={filteredBlogs}
          user={user}
          handleDeleteBlog={handleDeleteBlog}
          handleUpdateBlog={handleUpdateBlog} />
      </div>
    </div>
  )
}

export default App