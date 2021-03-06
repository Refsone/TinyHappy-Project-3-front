import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Moment from 'moment'
import 'moment/locale/fr'

import AddNewFamily from './AddNewFamily'
import Header from '../commons/header/Header'
import Member from './Member'
import Navbar from '../commons/footer/Navbar'
import Toast from '../commons/Toast'
import toaster from 'toasted-notes'

import './CardMembers.css'

const backUrl = process.env.REACT_APP_API_URL

const CardMembers = (props) => {
  const [members, setMembers] = useState([])
  const [user, setUser] = useState([])
  const [ageParams, setAgeParams] = useState()

  const myToken = (localStorage.getItem('x-access-token'))
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    fetchUser()
    fetchAgeParam()
  }, [])

  useEffect(() => {
    const fetchFamilyMembers = () => {
      axios.get(`${backUrl}/users/${userId}/family`, {
        headers: { Authorization: `Bearer ${myToken}` }
      })
        .then(res => {
          const data = res.data.sort((a, b) => triAlphaAsc(a, b))
          setMembers(data)
        })
    }
    fetchFamilyMembers()
  }, [])

  useEffect(() => {
    const { params } = props.location
    const sucessType = params && params.isModify ? 'mis à jour' : params && params.isDelete ? 'supprimé' : 'crée'
    if ((params && params.isSend) || (params && params.isDelete)) {
      toaster.notify(<Toast classType='sucess-toaster' text={`Le membre a bien été ${sucessType}`} />, { duration: localStorage.getItem('toastDura'), position: localStorage.getItem('toastPos') })
    } else if (params && !params.isSend && params && !params.isDelete) {
      toaster.notify(<Toast classType='error-toaster' text={'Une erreur s\'est produite!'} />, { duration: localStorage.getItem('toastDura'), position: localStorage.getItem('toastPos') })
    }
  }, [props.location])

  const fetchAgeParam = () => {
    axios.get(`${backUrl}/users/${userId}/parameter`, { headers: { Authorization: `Bearer ${myToken}` } })
      .then(res => setAgeParams(res.data[0].display_birthday))
      .catch(err => console.error(err))
  }

  const fetchUser = () => {
    axios.get(`${backUrl}/users/${userId}`, {
      headers: { Authorization: `Bearer ${myToken}` }
    })
      .then(res => setUser(res.data))
  }

  const formatDate = (date) => {
    Moment.locale('fr')
    if (date !== null) {
      return Moment(date).format('LL')
    } else {
      date = ''
      return date
    }
  }

  const triAlphaAsc = (a, b) => {
    var x = a.family_firstname.toLowerCase()
    var y = b.family_firstname.toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  }

  return (
    <>
      <Header burger />
      <div className='CardMembers'>
        {user[0] && <Member displayBirthday={ageParams} isUser={1} member={user[0]} familyBirthday={formatDate(user[0].user_birthday)} />}
        {members.map((member, key) => {
          return <Member displayBirthday={ageParams} isUser={0} member={member} familyBirthday={formatDate(member.family_birthday)} key={key} />
        })}
      </div>
      <AddNewFamily />
      <Navbar />
    </>
  )
}

export default CardMembers
