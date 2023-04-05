import React from 'react'
import {FcGoogle} from 'react-icons/fc'
const LoginWithOther:React.FC<{googleLogin:()=>void}> = ({googleLogin}) => {
  return (
    <div className='flex flex-col gap-4 relative w-full'>
          <section className='text-sm w-full relative h-4 items-center 
           after:absolute after:w-full after:bg-primary_dark after:h-[1px] after:left-0 after:top-3 after:opacity-30'>
            <p className='bg-white z-10 px-1 absolute w-max left-1/2 -translate-x-1/2 text-opacity-50 text-black'>Or continue with</p>
            </section>

            <section className='h-14 items-center relative flex justify-evenly w-full '>
              <div onClick={googleLogin} className='relative cursor-pointer overflow-hidden h-full p-2 border-primary border-2 aspect-square rounded-md'>
             <FcGoogle className='h-full w-full'/>
              </div>
             
              
           
            </section>
       </div>
  )
}

export default LoginWithOther