import React from 'react'

const LoginAddons:React.FC<{passwordResetHandler:()=>void,toggleRemember:()=>void,remember:boolean}> =({passwordResetHandler,toggleRemember,remember}) => {
  return (
    <ul className='flex justify-between w-full text-xs px-1'>
          
    <li className='flex gap-1'>
    <input checked={remember} onChange={toggleRemember} className='self-end  cursor-pointer' type="checkbox" id='rememberchbox' />
    <label className=' cursor-pointer font-semibold select-none text-primary_dark dark:text-primary'  htmlFor="rememberchbox">Remember me</label>
    </li>

    <li>
      <p onClick={passwordResetHandler} className=' text-primary_btns cursor-pointer hover:opacity-90 font-semibold'>Forgot password?</p>
    </li>


  </ul>
  )
}

export default LoginAddons