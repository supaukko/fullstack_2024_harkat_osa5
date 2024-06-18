import axios from 'axios'
const baseUrl = '/api/login'
import { USER_STORAGE_KEY } from '../config/constants'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const logout = async () => {
  window.localStorage.removeItem(USER_STORAGE_KEY)
}

export default { login, logout }