import React from 'react'

import './LogoHeader.css'

import monogramme from '../../../images/monogrammeTH.svg'

function Logo () {
  return (
    <div className='logo-container'>
      <img className='logo-monogramme' src={monogramme} alt='Logo Tiny Happy' />
    </div>
  )
}

export default Logo
