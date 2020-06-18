import React, { useState, useEffect } from 'react'
import './ButtonAuthor.css'

const Button = (props) => {
  const [color, setColor] = useState('')
  const [click, setClick] = useState(false)

  useEffect(() => {
    props.buttonSelectAuthor(props.id)
    click ? setColor(props.color) : setColor('')
  }, [click])

  return (
    <>
      <button onClick={() => setClick(!click)} style={{ backgroundColor: `${color}` }} className='author'>{props.name}</button>
    </>
  )
}

export default Button
