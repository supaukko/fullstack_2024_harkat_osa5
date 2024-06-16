import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getConfig = () => {
  console.log('getConfig', token)
  return { headers: { Authorization: token } }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const get = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, getConfig())
  return response.data
}

const update = async (id, object) => {
  console.log('Blogs - update', id)
  const response = await axios.put(`${baseUrl}/${id}`, object, getConfig())
  return response.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig())
}

export default {
  getAll, get, create, update , remove, setToken
}