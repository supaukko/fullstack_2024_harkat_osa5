const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  const blogObj = {
    title: 'Lorem ipsum dolor sit amet',
    author: 'Joe Doe',
    url: 'https://foo.fi',
    votes: '200',
    id: null
  }

  const userObj = {
    username: 'foobar',
    password: 'pass1',
    name: 'Foo Bar',
  }

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: userObj.name,
        username: userObj.username,
        password: userObj.password
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Blogit')
    await expect(locator).toBeVisible()
    await expect(page.getByText(/log in to application/i)).toBeVisible()
  })

  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, userObj.username, userObj.password)
    await expect(page.getByText(`${userObj.name} logged in`)).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, userObj.username, userObj.password + 'xxx')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText(`${userObj.name} logged in`)).not.toBeVisible()
  })

  describe('when logged in', () => {

    beforeEach(async ({ page }) => {
      await loginWith(page, userObj.username, userObj.password)
      //await page.waitForTimeout(3000)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blogObj)
      //await expect(page.locator(`p:has-text("${blogObj.title}"`).last()).toBeVisible()
      await expect(page.getByText(blogObj.title, { exact: false }).last()).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogObj)
      })

      test('likes can be increased', async ({ page }) => {
        await page.getByRole('button', { name: /view/i }).click()
        await page.getByRole('button', { name: /like/i }).click()
        const expectedSubstr = '' + (Number(blogObj.votes) + 1)
        await expect(page.getByTestId('blog_votes')).toContainText(expectedSubstr)
      })
    })
  })
})