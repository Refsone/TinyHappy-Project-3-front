import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import Header from '../commons/header/Header'
import Toast from '../commons/Toast'
import toaster from 'toasted-notes'
import useForm from './useForm'
import validationLogIn from './validateLogin'
import ValidateButton from '../commons/footer/ValidateButton'

import eyeClosed from '../../images/eye-slash-regular1.svg'
import eyeOpen from '../../images/eye-open.svg'

import './Connexion.css'

const backUrl = process.env.REACT_APP_API_URL

const Connexion = (props) => {
  localStorage.setItem('toastDura', 3000)
  localStorage.setItem('toastPos', 'bottom')
  const { handleChange, handleSubmit, values, errors, setErrors } = useForm(submit, validationLogIn)
  const [redirect, setRedirect] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [visible, setVisible] = useState(false)
  const showType = visible ? 'text' : 'password'

  useEffect(() => {
    const { params } = props.location
    let message = ''
    if (params) {
      if (params.isSend) {
        message = 'Inscription réussie !'
      } else if (params.newPwd) {
        message = 'Nouveau mot de passe crée !'
      }
      toaster.notify(<Toast classType='sucess-toaster' text={`${message}`} />, { duration: 3000, position: 'bottom' })
    }
  }, [props.location])

  useEffect(() => {
    if (loggedIn) {
      setRedirect(true)
    }
  }, [loggedIn])

  const handleServerError = (err) => {
    return err
  }

  async function submit (e) {
    e.preventDefault()
    try {
      await axios.post(`${backUrl}/users/login`, values)
        .then(res => res.headers['x-access-token'])
        .then(data => {
          if (data) {
            localStorage.clear()
            localStorage.setItem('x-access-token', data)
            localStorage.setItem('userId', jwt.decode(data).id)
            localStorage.setItem('userMail', jwt.decode(data).mail)
            localStorage.setItem('userName', jwt.decode(data).name)
            setLoggedIn(true)
          }
        })
    } catch (err) {
      errors && setErrors(errors)
      const errorToasty = handleServerError(err)
      toaster.notify(
        <Toast
          classType='error-toaster'
          text={`${errorToasty}, 'Adresse email ou mot de passe incorrect !'`}
        />,
        {
          duration: localStorage.getItem('toastDura'),
          position: localStorage.getItem('toastPos')
        }
      )
    }
  }
  return (
    <div className='connexion-background'>
      <Header location={props.location.pathname} />
      <form onSubmit={handleSubmit} className='general-form-connexion' noValidate>
        <label htmlFor='user_mail' name='user_mail' className='label-connexion'>email</label>
        <input name='user_mail' type='email' id='user_mail' className={`${errors.user_mail ? 'input-connexion-error' : 'input-connexion plholder bold-12px-grey'}`} placeholder='mon@email.com' value={values.email} onChange={handleChange} />

        {errors.user_mail && <p className='msg-error'>{errors.user_mail}</p>}

        <label htmlFor='user_password' className='label-connexion'>mot de passe</label>
        <div className='settings-container-eye'>
          <img src={visible ? eyeOpen : eyeClosed} onClick={() => setVisible(!visible)} alt='' />
        </div>
        <input name='user_password' type={showType} id='user_password' value={values.password} onChange={handleChange} className={`${errors.user_password ? 'input-pws-error' : 'input-psw-default plholder bold-12px-grey'}`} placeholder='**********' />
        {errors.user_password && <p className='msg-error'>{errors.user_password}</p>}
        <p className='connexion-lien'><Link to='/onboarding/lostpwd'>Mot de passe perdu ?</Link></p>

        <ValidateButton
          name='Se connecter' active={values.user_password.length >= 8} handleClick={(e) => submit(e)}
        />
        {redirect && <Redirect to='/moments' />}
      </form>
    </div>
  )
}

export default Connexion
