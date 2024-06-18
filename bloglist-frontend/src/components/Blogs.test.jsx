import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogs from './Blogs'

describe('<Blogs />', () => {
  let container
  let handleUpdateBlog
  let handleDeleteBlog
  let blogsObj
  let userObj

  beforeEach(() => {
    handleUpdateBlog = vi.fn()
    handleDeleteBlog = vi.fn()
    userObj = {
      username: 'username',
      name: 'User Name'
    }
    blogsObj = [{
      title: 'Lorem ipsum dolor sit amet',
      author: 'Joe Doe',
      url: 'https://foo.fi',
      votes: 2000,
      user: { ...userObj }
    }]

    container = render(
      <Blogs
        blogs={blogsObj}
        user={userObj}
        handleUpdateBlog={handleUpdateBlog}
        handleDeleteBlog={handleDeleteBlog} />).container
  })

  test('5.13. Renders only title and author fields of the blog', async () => {
    expect(screen.getByText(blogsObj[0].title, { exact: false })).toBeDefined()
    expect(screen.getByText(blogsObj[0].author, { exact: false })).toBeDefined()
    expect(screen.queryByText(blogsObj[0].url)).toBeNull()
    expect(screen.queryByText(blogsObj[0].votes)).toBeNull()
  })

  test('5.14. Renders all fields of the blog', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blogsObj[0].title, { exact: false })).toBeDefined()
    expect(screen.getByText(blogsObj[0].author, { exact: false })).toBeDefined()
    expect(screen.getByText(blogsObj[0].url, { exact: false })).toBeDefined()
    expect(screen.getByText(blogsObj[0].votes, { exact: false })).toBeDefined()
  })

  test('5.15. Event handler is called twice when the like button is pressed twice',
    async () => {

      const user = userEvent.setup()
      const viewButton = screen.getByText('view')

      await user.click(viewButton)
      const likeButton = screen.getByText('like')
      await user.click(likeButton)
      await user.click(likeButton)

      expect(handleUpdateBlog.mock.calls).toHaveLength(2)
    })
})