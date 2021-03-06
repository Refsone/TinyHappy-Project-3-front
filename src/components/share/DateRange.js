import React from 'react'
import fr from 'date-fns/locale/fr'

import DatePicker, { registerLocale } from 'react-datepicker'

import './DateRange.css'
import calendarIcon from '../../images/calendrier.svg'

registerLocale('fr', fr)

function DateRange (props) {
  const CustomInput = ({ value, onClick }) => (
    <div className='bold-12px-grey date-container' onClick={onClick}>
      <img src={calendarIcon} alt='calendar icon' />
      <p>{value || 'Entrez une date'}</p>
    </div>
  )
  return (
    <div className='DateRange'>
      <p className='bold-12px-grey'>Date de {props.dateType}</p>
      <DatePicker
        selected={props.date}
        onChange={props.onChange}
        locale='fr'
        dateFormat='EEEE dd MMMM yyyy'
        customInput={<CustomInput />}
        maxDate={(new Date())}
      />
    </div>
  )
}

export default DateRange
