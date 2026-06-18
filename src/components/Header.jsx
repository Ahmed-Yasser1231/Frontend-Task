import React from 'react'
import Searchbar from './Searchbar'

const Header = ({addNew, title, buttonTitle}) => {
  const resolvedTitle = title || 'Authors List';
  const resolvedButtonTitle = buttonTitle || `Add New ${resolvedTitle.split(' ')[0]}`;

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center'>
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 min-w-0'>
      <h1 className='text-lg sm:text-xl font-semibold text-gray-800 truncate'>{resolvedTitle}</h1>
      <div className='w-full sm:w-auto'>
        <Searchbar />
      </div>
    </div>
    <button className='bg-main text-white rounded px-4 py-2 w-full sm:w-auto whitespace-nowrap'
    onClick={() => {
        addNew()
    }}

    >{resolvedButtonTitle}</button>



   </div>
  )
}

export default Header