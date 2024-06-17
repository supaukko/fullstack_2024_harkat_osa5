import { useState } from 'react'

const Blog = ({
  blog,
  user,
  handleDeleteBlog,
  handleUpdateBlog}) => {

  const [isVisible, setIsVisible] = useState(false);

  //console.log(`Blog user=${user?.username}`, blog)

  const handleIncreaseLikes = () => {
    const updatedBlog = {...blog, ['votes']: blog.votes + 1}
    console.log('handleIncreaseLikes', updatedBlog)
    handleUpdateBlog(updatedBlog);
  }

  const toggleVisible = (event) => {
    event.preventDefault()
    setIsVisible(!isVisible)
  }

  const isRemoveEnabled = blog?.user?.username !== user?.username

  return (
    <div className={'blog'}>
      <div className={'row'}>
        <p className='paragraph'>{blog.title} -- {blog.author}</p>
        <div>
          <button
            className={'toggle-button'}
            onClick={toggleVisible}>
              {isVisible ? 'hide' : 'view'}
          </button>
        </div>
      </div>
      {isVisible && (
        <>
          <div className={'row'}>
            <p className='paragraph'>url: {blog.url}</p>
          </div>
          <div className={'row'}>
            <p className='paragraph'>likes: {blog.votes}</p>
            <div>
              <button
                onClick={handleIncreaseLikes}>like</button>
            </div>
          </div>
          <div className={'row'}>
            <p className='paragraph'>user: {blog.user?.name}</p>
          </div>
          { !isRemoveEnabled && (
            <button className={'blue-button'}
              onClick={() => handleDeleteBlog(blog.id)}
              disabled={isRemoveEnabled}>remove</button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog