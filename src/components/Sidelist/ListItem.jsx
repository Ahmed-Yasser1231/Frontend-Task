import React from 'react'

const ListItem = ({active, title, icon}) => {
  return (
    <div className={"flex items-center justify-center lg:justify-start border-b-2 lg:border-b-0 lg:border-l-2 px-3 py-2 lg:py-3 lg:px-0 transition-colors min-w-max lg:min-w-0 " + (active ? ' border-main text-main' : ' border-transparent text-inactive')}>
        <img src={icon} alt="icon" className={'w-4 h-4 lg:ml-[29px] ' + (active ? ' text-main' : '')} />
        <p className='ml-2 lg:ml-[29px] whitespace-nowrap'>{title}</p>
    </div>
  )
}

export default ListItem