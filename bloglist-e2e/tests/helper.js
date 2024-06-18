const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: /login/i }).click()
}

const logout = async (page)  => {
  await page.getByRole('button', { name: /logout/i }).click()
}

const createBlog = async (page, blogData) => {
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByTestId('author').fill(blogData.author)
  await page.getByTestId('title').fill(blogData.title)
  await page.getByTestId('url').fill(blogData.url)
  await page.getByTestId('votes').fill(blogData.votes)
  await page.getByRole('button', { name: /create/i }).click()
  await page.getByText(blogData.title, { exact: false }).last().waitFor()
}

const getVotes = async (blogItem) => {
  await blogItem.getByRole('button', { name: /view/i }).click()
  const text = await blogItem.getByTestId('blog_votes').textContent()
  const nbrMatch = text?.match(/\d+/)
  return nbrMatch ? parseInt(nbrMatch[0], 10) : null
}

export { loginWith, logout, createBlog, getVotes }