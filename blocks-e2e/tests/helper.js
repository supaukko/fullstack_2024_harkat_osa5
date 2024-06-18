const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

const createBlog = async (page, blogObj) => {
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByTestId('author').fill(blogObj.author)
  await page.getByTestId('title').fill(blogObj.title)
  await page.getByTestId('url').fill(blogObj.url)
  await page.getByTestId('votes').fill(blogObj.votes)
  await page.getByRole('button', { name: /create/i }).click()
}

export { loginWith, createBlog }