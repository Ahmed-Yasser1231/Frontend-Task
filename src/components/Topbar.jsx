import React from 'react'
import { useLocation } from 'react-router-dom'
import usrImg from '../assets/usr.png'
import { getPageMeta } from '../config/navigation'
const Topbar = () => {
  const location = useLocation()
  const meta = getPageMeta(location.pathname) || { title: '', subtitle: '' };

  return (
    <div className='mb-4 flex flex-col gap-3 border-b border-b-secondary-text pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
      <div className='flex flex-col justify-start items-start min-w-0'>
        <p className='text-lg sm:text-xl text-secondary-text truncate'>{meta.title}</p>
        <p className='text-sm sm:text-base font-light text-secondary-text truncate'>{meta.subtitle}</p>

      </div>
      <div className='flex items-center justify-start sm:justify-end gap-3'>
        <img src={usrImg} alt="profile" className='h-10 w-10 rounded-full object-cover shrink-0' />
        <p className='text-secondary-text font-light text-sm sm:text-base whitespace-nowrap'>User Name</p>

    </div>
    </div>
  )
}

export default Topbar