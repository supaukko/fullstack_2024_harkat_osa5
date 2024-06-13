function Login({
    username,
    setUsername,
    password,
    setPassword,
    handleLogin}) {

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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