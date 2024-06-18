const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, logout, createBlog, getVotes } = require('./helper')

describe('Blog app', () => {
  const blogsData = [
    {
      title: 'Lorem ipsum dolor sit amet',
      author: 'Joe Doe',
      url: 'https://foo.fi',
      votes: '200',
      id: null
    },
    {
      title: 'Nunc malesuada faucibus purus',
      author: 'Hemmo P',
      url: 'http://bar.fi',
      votes: '41000',
      id: null
    },
    {
      title: 'Praesent quis erat odio',
      author: 'Matti Näsä',
      url: 'http://jepjep.fi',
      votes: '1010',
      id: null
    }
  ]

  const usersData = [
    {
      username: 'foobar',
      password: 'pass1',
      name: 'Foo Bar',
    },
    {
      username: 'admin',
      password: 'passwd',
      name: 'Admin',
    }
  ]

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    for(let idx = 0; idx < usersData.length; idx++) {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: usersData[idx].name,
          username: usersData[idx].username,
          password: usersData[idx].password
        }
      })
    }

    await page.goto('http://localhost:5173')
  })

  test('5.17. Login form is shown', async ({ page }) => {
    await expect(page.getByText(/log in to application/i)).toBeVisible()
  })

  describe('5.18 Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, usersData[0].username, usersData[0].password)
      await expect(page.getByText(`${usersData[0].name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, usersData[0].username, usersData[0].password + 'xxx')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText(`${usersData[0].name} logged in`)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, usersData[1].username, usersData[1].password)
      for(let idx = 1; idx < blogsData.length; idx++) {
        await createBlog(page, blogsData[idx])
      }
      await logout(page)
      await loginWith(page, usersData[0].username, usersData[0].password)
    })

    test('5.19. a new blog can be created', async ({ page }) => {
      await createBlog(page, blogsData[0])
      await expect(page.getByText(blogsData[0].title, { exact: false }).last()).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogsData[0])
      })

      test('5.20. likes can be increased', async ({ page }) => {
        // Arrange
        const firstBlog = await page.locator('ul > li:first-child')
        const paragraphText = await firstBlog.locator('p').textContent()
        const blogData = blogsData.find(blogData => paragraphText.includes(blogData.title))
        const expectedSubstr = '' + (Number(blogData.votes) + 1)

        // Act
        await firstBlog.getByRole('button', { name: /view/i }).click()
        await firstBlog.getByRole('button', { name: /like/i }).click()

        // Assert
        await expect(firstBlog.getByTestId('blog_votes'))
          .toContainText(expectedSubstr)
      })

      test('5.21 the user who added the blog can delete the blog', async ({ page }) => {
        // Arrange
        const regexTitle = new RegExp(`${blogsData[0].title}`)
        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain(blogsData[0].title)
          await dialog.accept()
        })
        const blogItem = await page.getByRole('listitem').filter({ hasText: regexTitle })

        // Act
        await blogItem.getByRole('button', { name: /view/i }).click()
        await blogItem.getByRole('button', { name: /remove/i }).click()

        // Assert
        await expect(page.getByRole('listitem').filter({ hasText: regexTitle }))
          .toHaveCount(0)
      })

      test('5.22 only the user who added the blog can see the blog\'s delete button', async ({ page }) => {
        // Arrange
        const regexTitle = new RegExp(`${blogsData[1].title}`)
        const blogItem = await page.getByRole('listitem').filter({ hasText: regexTitle })

        // Act
        await blogItem.getByRole('button', { name: /view/i }).click()

        // Assert
        await expect(blogItem.getByRole('button', { name: /remove/i })).not.toBeVisible()
      })

      test('5.23 blogs are arranged in descending order according to likes', async ({ page }) => {
        // Arrange
        const blogItems = await page.locator('ul.list-no-style > li')
        const blogCount = await blogItems.count()
        const expectedVotes = blogsData.map(blog => Number(blog.votes)).sort((a, b) => b - a)
        const actualVotes = []

        // Act
        for (let idx = 0; idx < blogCount; idx++) {
          const blog = await blogItems.nth(idx)
          actualVotes.push(await getVotes(blog))
        }

        // Assert
        // console.log(actualVotes, expectedVotes)
        expect(actualVotes).toEqual(expectedVotes)
      })
    })
  })
})
