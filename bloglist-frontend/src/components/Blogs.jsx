import Blog from './Blog'

import { useState } from 'react'
import PropTypes from 'prop-types'

const Blogs = ({
  blogs,
  user,
  handleUpdateBlog,
  handleDeleteBlog }) => {

  return (
    <div>
      {
        blogs.map(blog => <Blog
          key={blog.id}
          blog={blog}
          handleUpdateBlog={handleUpdateBlog}
          user={user}
          handleDeleteBlog={handleDeleteBlog} />)
      }
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

Notification.defaultProps = {
  user: null
}

export default Blogs