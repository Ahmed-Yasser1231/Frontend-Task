import React from 'react'
import logo from '../../assets/logo.svg'
import { NavLink, Link } from 'react-router-dom'
import ListItem from './ListItem'
import shopIcon from '../../assets/shop.jpg'
import storeIcon from '../../assets/Bookstore.svg'
import authorIcon from '../../assets/Featherpen.svg'
import bookIcon from '../../assets/Book.svg'
import { navItems } from '../../config/navigation'

const Sidelist = () => {
  const icons = {
    '/': shopIcon,
    '/stores': storeIcon,
    '/author': authorIcon,
    '/books': bookIcon,
  }
  return (
    <div className='w-full lg:w-[248px] flex flex-col lg:min-h-screen border-b lg:border-b-0 lg:border-r border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70'>

      <div className='logoSection flex items-center justify-between lg:justify-start h-20 lg:h-36 px-4 lg:px-0 lg:pl-[29px]' >
        <Link to='/' aria-label='Go to shop home' className='inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-sm'>
          <img src={logo} alt="logo" className='inline-block h-8 w-auto lg:ml-[29px] lg:mt-[51px] cursor-pointer' />
        </Link>
      </div>
      <ul className='flex flex-row lg:flex-col lg:justify-start items-stretch lg:items-start gap-2 lg:gap-4 overflow-x-auto lg:overflow-visible px-3 pb-3 lg:px-0 lg:pb-0 lg:h-full'>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className="shrink-0 w-auto lg:w-full">
            {({ isActive }) => (
              <ListItem active={isActive} title={item.title} icon={icons[item.path]} />
            )}
          </NavLink>
        ))}
      </ul>
    </div>
  )
}

export default Sidelist

