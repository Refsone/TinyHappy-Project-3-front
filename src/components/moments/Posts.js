import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Moment from 'moment'
import 'moment/locale/fr'

import AddNewMoment from './AddNewMoment'
import CardPost from './CardPost'
import Header from './../commons/header/Header'
import Navbar from '../commons/footer/Navbar'
import NoMoment from './NoMoment'
import Toast from '../commons/Toast'
import toaster from 'toasted-notes'

import './Posts.css'

const backUrl = process.env.REACT_APP_API_URL

const Posts = (props) => {
  const [moments, setMoments] = useState([])
  const [user, setUser] = useState()
  const [refresh, setRefresh] = useState([false])
  let date = ''

  const myToken = localStorage.getItem('x-access-token')
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchUserMoment()
    fetchUser()
  }, [refresh])

  useEffect(() => {
    const { params } = props.location
    if ((params && params.isSend) || (params && params.isDelete)) {
      const sucessType = params && params.isSend === 'modify' ? 'mis à jour' : params.isDelete ? 'supprimé' : 'crée'
      toaster.notify(<Toast classType='sucess-toaster' text={` Votre moment a été ${sucessType} avec succès !`} />, { duration: localStorage.getItem('toastDura'), position: localStorage.getItem('toastPos') })
    } else if (params && !params.isSend) {
      toaster.notify(<Toast classType='error-toaster' text={' Une erreur s\'est produite dans l\'ajout d\'un moment!'} />, { duration: localStorage.getItem('toastDura'), position: localStorage.getItem('toastPos') })
    }
  }, [props.location])

  const fetchUserMoment = () => {
    axios.get(`${backUrl}/users/${userId}/moments`, {
      headers: { Authorization: `Bearer ${myToken}` }
    })
      .then(res => setMoments(res.data))
  }

  const fetchUser = () => {
    axios.get(`${backUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${myToken}` }
    })
      .then(res => setUser(res.data))
  }

  const formatDate = (date) => {
    Moment.locale('fr')
    return Moment(date).format('LL')
  }

  const getRandom = () => {
    return Math.floor(Math.random() * Math.floor(100))
  }

  const createCardPost = (moment, id) => {
    if (date !== moment.moment_event_date) {
      date = moment.moment_event_date
      return (
        <>
          <p className='moment-date'>{formatDate(moment.moment_event_date)}</p>
          <CardPost refreshMethod={refreshMethod} locationPath={props.location.pathname} moment={moment} user={user} key={getRandom()} />
        </>
      )
    } else {
      date = moment.moment_event_date
      return (
        <>
          <CardPost refreshMethod={refreshMethod} locationPath={props.location.pathname} moment={moment} user={user} key={getRandom()} boxStyle='8px' />
        </>
      )
    }
  }

  const refreshMethod = () => {
    setRefresh(!refresh)
  }
  return (
    <>
      <Header burger />
      <div className='Posts'>
        {moments.length === 0 && <NoMoment />}
        {moments.map((moment, key) => {
          if (props.location.pathname === '/favoris') {
            if (moment.moment_favorite) {
              return createCardPost(moment, key)
            } else {
              return ''
            }
          } else {
            return createCardPost(moment, key)
          }
        })}
        <AddNewMoment />
        <Navbar />
      </div>
    </>
  )
}

export default Posts
