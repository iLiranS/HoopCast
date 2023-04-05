'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import LoginForm from '../Authentication/LoginForm';
import {BsFillSunFill , BsFillMoonFill} from 'react-icons/bs'
import {AiOutlineUser , AiOutlineLogout} from 'react-icons/ai'
import useThemeStore from '@/src/store/useThemeStore';
import useAuthStore from '@/src/store/useAuthStore';
import Image from 'next/image';




const Header = () => {
    const [isLoginInFormOpen , setIsLoginFormOpen] = useState(false);
    const [isImageLoading,setIsImageLoading] = useState(true);
    const [expandProfile,setExpandProfile] = useState(false);
    const currentUser = useAuthStore((state)=> state.currentUser);
    const logout = useAuthStore((state)=>state.logout)
    const currentTheme = useThemeStore((state)=>state.theme);
    const toggleTheme = useThemeStore((state)=>state.toggleTheme)

    const toggleLoginFormOpen =()=> setIsLoginFormOpen(prev => !prev);

    useEffect(()=>{
        if (currentTheme === 'dark') document.body.classList.add('dark');
        else {
            if (document.body.classList.contains('dark')) document.body.classList.remove('dark');
        }
      
    },[currentTheme])

    const logoutHandler = () =>{
      logout();
    }

    const expandProfileHandler = () =>{
      setExpandProfile(prev =>!prev);
    }
  

  return (
    <header className='h-12 z-20 border-b-[1px] fixed top-0 flex w-screen items-center px-4 md:px-8 transition-colors
     bg-primary dark:bg-primary_dark dark:text-slate-100
     border-opacity-20 border-primary_dark
     dark:border-opacity-10 dark:border-primary '>

   <nav className='flex items-center w-full justify-between'>
   
    <ul>
      <li>
        <Link href='/'>HoopCast</Link>
      </li>

        
    </ul>

    <ul className='flex items-center gap-4 z-10'>
        <li onClick={toggleTheme} className={`items-center p-2 bg-slate-700 bg-opacity-40 dark:bg-slate-100 dark:bg-opacity-30 rounded-md select-none cursor-pointer
        hover:bg-opacity-30 dark:hover:bg-opacity-50
         ${currentTheme==='dark' ? 'rotate-180' : 'rotate-0'} transition-all duration-500`}>
            {currentTheme==='dark' ? <BsFillSunFill/> : <BsFillMoonFill/>}</li>
        <li>
        {currentUser?
      
        <section onClick={expandProfileHandler} className='flex flex-col relative'>
          <div className='h-full aspect-square relative w-8 cursor-pointer'>
            {isImageLoading && <div className='h-full w-full rounded-full bg-gray-700 animate-pulse absolute top-0 left-0'></div>}
          <Image onLoad={()=>{setIsImageLoading(false)}} layout='fill' objectFit='cover' className='rounded-full aspect-square' alt='userAvatar' src={currentUser.photoURL?? ''}/>
          </div>
          <ul className={`${expandProfile ? 'h-max' : 'max-h-0 opacity-0 hidden'} z-20 transition-transform flex flex-col absolute translate-y-1/2 top-0 gap-1 right-0 
            bg-primary_dark dark:bg-primary rounded-md py-2 px-2`}>
            <li className='profile_list_item '>
              <Link className='flex items-center' href={`/profile/${currentUser.uid}`}>
               <AiOutlineUser/> <p>{currentUser.displayName}</p>
              </Link>
               </li>
            <li onClick={logoutHandler} className=' profile_list_item border-t-2 border-primary dark:border-primary_dark border-opacity-20 dark:border-opacity-20'><AiOutlineLogout/><p>Logout</p></li>
          </ul>

        </section>

         : <p className='py-1 px-3 text-primary dark:text-primary_dark cursor-pointer bg-primary_btns dark:bg-primary_dark_btns rounded-lg' onClick={toggleLoginFormOpen}>Login</p>}
        </li>
    </ul>

    

   </nav>
   {isLoginInFormOpen && <LoginForm onClose={toggleLoginFormOpen}/>}
    </header>
  )
}

export default Header