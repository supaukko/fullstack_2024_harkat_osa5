import Blog from './Blog'

const Blogs = ({
  blogs,
  handleDelete,
  blogData,
  handleRowSelect,
  user }) => {

  console.log('Blogs', user)
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
            handleDelete={handleDelete}
            isDeleteDisabled={user == null}
            blogData={blogData}
            handleRowSelect={handleRowSelect} />)
      }
      </tbody>
    </table>
  )
}

export default Blogs