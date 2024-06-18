import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({
  blog,
  user,
  handleDeleteBlog,
  handleUpdateBlog }) => {

  const [isVisible, setIsVisible] = useState(false)

  //console.log(`Blog user=${user?.username}`, blog)

  const handleIncreaseLikes = () => {
    const updatedBlog = { ...blog, ['votes']: blog.votes + 1 }
    console.log('handleIncreaseLikes', updatedBlog)
    handleUpdateBlog(updatedBlog)
  }

  const toggleVisible = (event) => {
    event.preventDefault()
    setIsVisible(!isVisible)
  }

  const isRemoveEnabled = blog?.user?.username !== user?.username

  return (
    <li className={'blog'}>
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
            <p
              className='paragraph'
              data-testid='blog_votes'>likes: {blog.votes}</p>
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
    </li>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  handleDeleteBlog: PropTypes.func,
  handleUpdateBlog: PropTypes.func
}

Blog.defaultProps = {
  user: null,
  handleDeleteBlog: undefined,
  handleUpdateBlog: undefined
}
export default Blog