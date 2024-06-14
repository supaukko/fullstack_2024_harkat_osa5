import { useState } from 'react'

function Login({handleLogin}) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  /**
   * Login
   * @param {*} event 
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

    return (
        <div className='border'>
            <h2>log in to application</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password" 
                        name="password"
                        type="password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login