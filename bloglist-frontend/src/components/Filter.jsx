function Filter({filter, handleChange}) {

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

export default Filter
