import React from 'react'
import PropTypes from 'prop-types'
import ButtonAuthor from './ButtonAuthor'
import { Link } from 'react-router-dom'
import BoutonPlus from '../../../images/BoutonPlus.svg'

import './AuthorSelect.css'

const AuthorSelect = (props) => {
  const authors = props.familyMember

  const AddButtonPlus = () => (
    <div className='AddFamilyMember'>
      <Link to='/family/create'><img src={BoutonPlus} alt='Bouton Plus icon' /></Link>
    </div>
  )

  return (
    <div className='authorSelect'>
      <p className='authorTitle'>{props.title}</p>
      <div className='authorList'>
        {props.user && <ButtonAuthor buttonSelectAuthor={props.buttonSelectAuthor} color={props.user.color} name={props.user.user_firstname} id={props.user.user_firstname} />}
        {authors.map((author, index) =>
          <ButtonAuthor key={index} buttonSelectAuthor={props.buttonSelectAuthor} color={author.color} name={author.family_firstname} id={author.member_id} />
        )}
        {<AddButtonPlus />}
      </div>
      <p className='error-author' style={props.textInMomentArea.length > 0 && props.memberFamilyIsPresentAtMoment.length === 0 && props.userIsPresent === 0 ? { visibility: 'visible' } : { visibility: 'hidden' }}>Veuillez selectionner un auteur </p>
    </div>
  )
}

AuthorSelect.propTypes = {
  familyMember: PropTypes.array.isRequired,
  memberFamilyIsPresentAtMoment: PropTypes.array.isRequired,
  userIsPresent: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  textInMomentArea: PropTypes.string
}

export default AuthorSelect
