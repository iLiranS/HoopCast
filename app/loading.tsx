import Spinner from '@/src/components/Spinner/Spinner'
import React from 'react'

const loading = () => {

  return (
    <ul className='flex w-[500px] mx-auto h-max flex-col gap-2 justify-center pt-20 items-center px-2 md:px-0 animate-pulse'>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
    <li className='bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 w-full h-14 rounded-md'></li>
 </ul>
  )
}

export default loading