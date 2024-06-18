import Blog from './Blog'

import { useState } from 'react'
import PropTypes from 'prop-types'

const Blogs = ({
  blogs,
  user,
  handleUpdateBlog,
  handleDeleteBlog }) => {

  return (
    <ul className={'list-no-style'}>
      {
        blogs.map(blog => <Blog
          key={blog.id}
          blog={blog}
          handleUpdateBlog={handleUpdateBlog}
          user={user}
          handleDeleteBlog={handleDeleteBlog} />)
      }
    </ul>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  handleUpdateBlog: PropTypes.func.isRequired,
  handleDeleteBlog: PropTypes.func.isRequired
}

Blogs.defaultProps = {
  user: null
}

export default Blogs