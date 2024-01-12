import React from 'react'
import { ScaleLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className='loader-container'>
    <ScaleLoader size={70} color='#fff' />
  </div>
  )
}

export default Loading
