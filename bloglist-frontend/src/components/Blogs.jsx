import Blog from './Blog'

import { useState } from 'react'

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

export default Blogs