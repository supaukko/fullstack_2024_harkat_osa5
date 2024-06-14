import { useState, useImperativeHandle, forwardRef } from 'react'

/**
 * Komponentin luova funktio on kääritty funktiokutsun forwardRef sisälle,
 * jolloin komponentti pääsee käsiksi sille määriteltyyn refiin.
 * Komponentti tarjoaa useImperativeHandle-hookin avulla sisäisesti
 * määritellyn funktionsa toggleVisibility ulkopuolelta kutsuttavaksi
 */
const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  console.log('Togglable', props, ref)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        <div className='border' >
        {props.children}
        </div>
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )

})

export default Togglable