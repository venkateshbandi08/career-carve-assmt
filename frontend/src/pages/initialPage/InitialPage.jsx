import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const InitialPage = () => {
    const navigate = useNavigate()
    const [person, setPerson] = useState('student');
    const onClickContinue = () => {
        if (person === 'student'){
            navigate('/student-login')
        }else{
            navigate('/mentor-login')
        }
    }
  return (
    <div>
      <h1> Welcome to career carve </h1>
      Do you want to login as Student / Mentor ? Select below
      <select name="" id="" onChange={(event) => setPerson(event.target.value)}>
        <option value="student"> Student </option>
        <option value="mentor"> Mentor </option>
      </select>
      <button onClick={onClickContinue}> continue </button>
    </div>
  )
}

export default InitialPage

