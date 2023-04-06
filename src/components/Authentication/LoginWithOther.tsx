import React from 'react'
import {FcGoogle} from 'react-icons/fc'
const LoginWithOther:React.FC<{googleLogin:()=>void}> = ({googleLogin}) => {
  return (
    <div className='flex flex-col gap-2 relative w-full'>
          <section className='text-sm  w-full relative h-4 items-center dark:after:bg-primary
           after:absolute after:w-full after:bg-primary_dark after:h-[1px] after:left-0 after:top-3 after:opacity-30'>
            <p className='bg-gray-200 dark:bg-primary_dark bg-opacity-80  rounded-md z-10 px-1 absolute w-max left-1/2 -translate-x-1/2 text-opacity-70 text-black dark:text-white'>Or continue with</p>
            </section>

            <section className='h-10 aspect-square items-center relative flex justify-evenly w-full '>
              <div onClick={googleLogin} className='relative cursor-pointer overflow-hidden h-full  bg-white  bg-opacity-10 aspect-square rounded-md'>
             <FcGoogle className='h-full w-full'/>
              </div>
             
              
           
            </section>
       </div>
  )
}

export default LoginWithOther