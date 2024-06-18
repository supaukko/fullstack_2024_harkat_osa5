import PropTypes from 'prop-types'

const Notification = ({ message, style }) => {
  if (message === null || style === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  style: PropTypes.string
}

Notification.defaultProps = {
  message: null,
  style: null
}

export default Notification