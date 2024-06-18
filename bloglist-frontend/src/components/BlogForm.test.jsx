import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  let handleAddBlog

  beforeEach(() => {
    handleAddBlog = vi.fn()
    container = render(
      <BlogForm handleAddBlog={handleAddBlog} />).container
  })

  test('5.16. The callback contains the correct data for the new blog',
    async () => {
      // Arrange
      const user = userEvent.setup()
      const blogObj = {
        title: 'Lorem ipsum dolor sit amet',
        author: 'Joe Doe',
        url: 'https://foo.fi',
        votes: '200',
        id: null
      }
      const authorInput = container.querySelector('#author')
      const titleInput = container.querySelector('#title')
      const urlInput = container.querySelector('#url')
      const votesInput = container.querySelector('#votes')
      const createBtn = screen.getByText('create')

      // Act
      await user.type(authorInput, blogObj.author)
      await user.type(titleInput, blogObj.title)
      await user.type(urlInput, blogObj.url)
      await userEvent.clear(votesInput)
      await user.type(votesInput, blogObj.votes)
      await user.click(createBtn)

      // Assert
      expect(handleAddBlog.mock.calls).toHaveLength(1)
      expect(handleAddBlog.mock.calls[0][0]).toEqual(blogObj)
    })

})