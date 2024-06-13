function User({user}) {

return (
    <div>
      { user ?
          (<p>{user?.name} logged in</p>) :
          (<p>Not logged in</p>)
      }
    </div>
  )
}

export default User