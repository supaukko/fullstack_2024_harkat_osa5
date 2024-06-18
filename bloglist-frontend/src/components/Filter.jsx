
import PropTypes from 'prop-types'
function Filter({ filter, handleChange }) {
  return (
    <div>
      <label htmlFor="filter">Suodata</label>
      <input
        id="filter"
        type="text"
        name="filter"
        value={filter}
        onChange={handleChange}
        placeholder="..."
      />
    </div>
  )
}

Filter.propTypes = {
  filter: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default Filter
