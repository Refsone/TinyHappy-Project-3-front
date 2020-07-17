import React, { useState, useEffect } from 'react'
import axios from 'axios'
import useForm from './../onboarding/useForm'
import validationEmail from './validateEmail'

import Toast from '../commons/Toast'
import toaster from 'toasted-notes'

import './../onboarding/Connexion.css'
import './Password.css'
import './Email.css'

import { Redirect } from 'react-router-dom'

const backUrl = process.env.REACT_APP_API_URL
const myToken = (localStorage.getItem('x-access-token'))
const userId = localStorage.getItem('userId')

const Email = (props) => {
  const { handleChange, handleSubmit, values, errors } = useForm(submit, validationEmail)

  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    const { params } = props.location
    if (params && params.isSend) {
      toaster.notify(<Toast classType='sucess-toaster' text='Inscription réussie !' />, { duration: localStorage.getItem('toastDura'), position: localStorage.getItem('toastPos') })
    }
  }, [])

  function submit () {
    axios.put(`${backUrl}/users/${userId}/modify-email`, values, {
      headers: { Authorization: `Bearer ${myToken}` }
    })
      .then(res => {
        if (values.user_mail !== values.new_user_mail) {
          console.log('Il y a une erreur dans votre email')
        } else if (res.status === 200) {
          console.log('votre email n\'existe pas')
        }
      })
  }

  useEffect(() => {
    if (redirect) {
      setRedirect(true)
    }
  }, [redirect])

  return (
    <div className='settings-container-pwdmail'>
      <h1 className='settings-pwmail-title bold-16px-grey'>modification votre adresse email</h1>
      <form onSubmit={handleSubmit} className='general-form-connexion' noValidate>
        <label htmlFor='user_mail' name='user_mail' className='label-settings bold-12px-grey'>Nouvelle adresse mail</label>
        <input name='user_mail' type='text' id='user_mail' value={values.user_mail} onChange={handleChange} className={`${errors.user_mail ? 'input-email-error' : 'input-email plholder bold-12px-grey'}`} placeholder='prenom@exemple.com' />
        {errors.user_mail && <p className='msg-error-email'>{errors.user_mail}</p>}

        <label htmlFor='user_mail' className='label-settings bold-12px-grey'>confirmation de la nouvelle adresse mail</label>
        <input name='new_user_mail' type='text' id='new_user_mail' value={values.new_user_mail} onChange={handleChange} className={`${errors.new_user_mail ? 'input-email-error' : 'input-email plholder bold-12px-grey'}`} placeholder='prenom@exemple.com' />
        {errors.new_user_mail && <p className='msg-error-email'>{errors.new_user_mail}</p>}

        {errors ? <button type='submit' className='connexion-btn-inactif'>confirmer</button> : <button type='submit' className='connexion-btn-actif' onClick={(e) => submit(e)}>confirmer</button>}
        {redirect && <Redirect to='/settings' />}
      </form>
    </div>
  )
}

export default Email
