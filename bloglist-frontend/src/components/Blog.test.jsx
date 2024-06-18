import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let blogObj
  let userObj

  beforeEach(() => {
    blogObj = {
      title: 'Lorem ipsum dolor sit amet',
      author: 'Joe Doe',
      url: 'https://foo.fi',
      votes: 2
    }
    userObj = {
      username: 'username',
      name: 'User Name'
    }
    container = render(
      <Blog blog={blogObj} user={userObj} />).container
  })

  test('renders content - text selector', () => {
    const element = screen.getByText(/Lorem ipsum dolor sit amet/i)
    expect(element).toBeDefined()
  })

  test('renders content - class secter', () => {
    const div = container.querySelector('.blog')
    // screen.debug(div)
    expect(div).toHaveTextContent(/Lorem ipsum dolor sit amet/i)
  })
})