import Blog from './Blog'

import { useState } from 'react'

const Blogs = ({
  blogs,
  selectedBlog,
  isDeleteDisabled,
  handleBlogDelete,
  handleBlogSelect }) => {

  return (
    <table>
      <thead>
        <tr>
          <th>Author</th>
          <th>Title</th>
          <th>Url</th>
          <th>Likes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {
        blogs.map(blog => <Blog
            key={blog.id}
            blog={blog}
            selectedBlog={selectedBlog}
            isDeleteDisabled={isDeleteDisabled}
            handleBlogDelete={handleBlogDelete}
            handleBlogSelect={handleBlogSelect} />)
      }
      </tbody>
    </table>
  )
}

export default Blogs