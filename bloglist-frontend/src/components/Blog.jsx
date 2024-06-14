const Blog = ({
  blog,
  handleDelete,
  isDeleteDisabled,
  blogData,
  handleRowSelect}) => {
  return (
    <tr
      onClick={() => handleRowSelect(blog)}
      className={blogData && blogData.id === blog.id ? 'selected' : ''}
    >
      <td>{blog.title}</td>
      <td>{blog.author}</td>
      <td>{blog.url}</td>
      <td>{blog.votes}</td>
      <td>
        <button
          onClick={() => handleDelete(blog.id)}
          disabled={isDeleteDisabled}>Delete</button>
      </td>
    </tr>
  )
}

export default Blog