function User({user, handleLogout}) {

return (
    <div>
      { user ?
          (
            <div>
              <p>{user?.name} logged in</p>
              <div>
                <button onClick={() => handleLogout()}>Logout</button>
              </div>
            </div>
          ) :
          (<p>Not logged in</p>)
      }
    </div>
  )
}

export default User