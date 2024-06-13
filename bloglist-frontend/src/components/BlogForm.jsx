const BlogForm = ({
    blogData,
    handleSubmit,
    handleChange,
    handleClear}) => {
  console.log('BlogForm', blogData)
  const header = blogData.id !== null && blogData.id.trim() !== '' ?
    'Update' : 'Add a new'
  return (
    <div>
      <h3>{header}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">author:</label>
          <input
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

export default BlogForm