import React from 'react'

const loading = () => {
  return (
    <div className='h-full w-full max-w-[600px] mx-auto flex flex-col  relative pt-12 gap-2 pb-8'>

    <div className='h-[280px] bg-primary_dark dark:bg-primary rounded-md rounded-b-none animate-pulse'></div>
    <ul className='h-max w-full p-2 gap-2 flex flex-col bg-primary_dark dark:bg-primary rouneded-md animate-pulse'>
      <li className=' h-10 w-full bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md animate-pulse'></li>
      <li className=' h-10 w-full bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md animate-pulse'></li>
      <li className=' h-10 w-full bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md animate-pulse'></li>
      <li className=' h-10 w-full bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md animate-pulse'></li>
      <li className=' h-10 w-full bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md animate-pulse'></li>
       </ul>
  
  
  </div>
  )
}

export default loading