const Blog = ({
  blog,
  selectedBlog,
  isDeleteDisabled,
  handleBlogDelete,
  handleBlogSelect}) => {
  return (
    <tr
      onClick={() => handleBlogSelect(blog)}
      className={selectedBlog?.id === blog.id ? 'selected' : ''}>
      <td>{blog.title}</td>
      <td>{blog.author}</td>
      <td>{blog.url}</td>
      <td>{blog.votes}</td>
      <td>
        <button
          onClick={() => handleBlogDelete(blog.id)}
          disabled={isDeleteDisabled}>Delete</button>
      </td>
    </tr>
  )
}

export default Blog