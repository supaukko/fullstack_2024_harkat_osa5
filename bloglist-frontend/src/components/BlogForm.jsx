

import { useState } from 'react'
import PropTypes from 'prop-types'

const defaultBlogData = {
  author: '',
  title: '',
  url: '',
  votes: 0,
  id: null
}

const BlogForm = ({ handleAddBlog }) => {

  const [blogData, setBlogData] = useState({ ...defaultBlogData })

  const header = 'Add a new blog'
  /**
   * Handle change
   * @param {*} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target
    setBlogData({
      ...blogData,
      [name]: value
    })
  }

  /**
   * Clear blog data
   */
  const handleClear = (event) => {
    event.preventDefault()
    setBlogData({ ...defaultBlogData })
  }

  /**
   * Handle the addition of a new blog or the update of an old blog
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleAddBlog(blogData)
    setBlogData({ ...defaultBlogData })
  }

  return (
    <div>
      <h3>{header}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">author:</label>
          <input
            data-testid="author"
            type="text"
            id="author"
            name="author"
            value={blogData.author}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="title">title:</label>
          <input
            data-testid="title"
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            data-testid="url"
            type="text"
            id="url"
            name="url"
            value={blogData.url}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="votes">likes:</label>
          <input
            data-testid="votes"
            type="text"
            id="votes"
            name="votes"
            value={blogData.votes}
            onChange={handleChange}
          />
        </div>
        <button onClick={(event) => handleClear(event)}>clear form</button>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  handleAddBlog: PropTypes.func.isRequired
}

export default BlogForm