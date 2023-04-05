import useInput from '@/src/hooks/useInput'
import React, { useCallback, useState } from 'react'
import Portal from '../Ui/Portal'
import {AiFillEye , AiFillEyeInvisible , AiFillCloseCircle} from 'react-icons/ai'
import Spinner from '../Spinner/Spinner'
import useAuthStore from '@/src/store/useAuthStore'
import SignUpAvatar from './SignUpAvatar'
import LoginAddons from './LoginAddons'
import LoginWithOther from './LoginWithOther'


// email validation simple
function validateEmailInput(email:string) {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}


const LoginForm:React.FC<{onClose:()=>void}> = ({onClose}) => {
 
// states and functions
  const [isLogin,setIsLogin] = useState(true); // false = sign up.
  const [isPasswordShown,setIsPasswordShown] = useState(false);
  const [remember,setRemember] = useState(true);
  const [avatar,setAvatar] = useState<null|string>(null);
  const [error,setError] = useState<any>(null);
  const [isLoading,setIsLoading] = useState(false);
  const loginWithEmail = useAuthStore((state)=>state.loginWithEmail);
  const loginWithGoogle = useAuthStore((state)=> state.loginWithGoogle);
  const forgotPassword = useAuthStore((state)=> state.forgotPassword);

/// inputs validations
  const validateEmail = (email:string):boolean =>{
    return validateEmailInput(email);
  }
  const validatePassword = (password:string):boolean =>{
    return password.length >6;
  }
  const validateConfirmPassword = (password:string):boolean =>{
    return password===passwordInput.value;

  }
  const validateUserName= (userName:string):boolean =>{
    return userName.length >2 && userName.length < 30;
  }

  // toggle password visible
  const togglePassowrdShown = () => setIsPasswordShown(prev=>!prev);

  // inputs hooks
  const emailInput = useInput({validateInput:validateEmail});
  const passwordInput = useInput({validateInput:validatePassword});
  const confirmPasswordInput = useInput({validateInput:validateConfirmPassword})
  const userNameInput = useInput({validateInput:validateUserName})

  //  form validations
  const isFormSignInValid = emailInput.isValid && passwordInput.isValid;
  const isFormSignUpValid = emailInput.isValid && passwordInput.isValid && confirmPasswordInput.isValid && userNameInput.isValid && avatar;

  // update inputs
  const updateEmailInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    emailInput.updateInput(event.target.value)
    emailInput.setTouch(false);
  }
  const updatePasswordInput = (event:React.ChangeEvent<HTMLInputElement>)=>{
    passwordInput.updateInput(event.target.value);
    passwordInput.setTouch(false);
  }
  const updateConfirmPasswordInput= (event:React.ChangeEvent<HTMLInputElement>)=>{
    confirmPasswordInput.updateInput(event.target.value);
    confirmPasswordInput.setTouch(false);
  }
  const updateUserNameInput= (event:React.ChangeEvent<HTMLInputElement>)=>{
    userNameInput.updateInput(event.target.value);
    userNameInput.setTouch(false);
  }

  // login with email 
  const loginEmailHandler = async() =>{
    setIsLoading(true);
    setError(null);
    const didLoginError = await loginWithEmail(emailInput.value,passwordInput.value,remember);
    if (!didLoginError) {
      onClose();
      return;
    }
    setIsLoading(false);
    setError(didLoginError);
  }
 
  // sign up email
const signUpEmailHandler = async()=>{
  setIsLoading(true);
  setError(null);


  try{
    const response = await fetch('/api/adduser',{
      method:'POST',
      body:JSON.stringify({email:emailInput.value,password:passwordInput.value,username:userNameInput.value,photoURL:avatar}),
      headers:{'Content-Type':'application/json'}
    })
    if (response.ok){
      const data = await response.json();
      setError(typeof data.message === 'string' ? data.message : 'An error occurred');
      setIsLogin(true);
      }
    else{
      const data = await response.json();
      throw new Error(data.message.code);
    }
      
    
    
  }
  catch(error){
     setError(error.message);
  }
  setIsLoading(false);

}
// google login handler
const googleLoginHandler = async()=>{
  setIsLoading(true);
  const result = await loginWithGoogle();
  setIsLoading(false);
  if (result!==true) setError('failed');
  else{
    // successfull
    onClose();
    return;
  }
}
// avatar handler
const updateAvatarHandler = useCallback((avatar:string)=>{
  setAvatar(avatar);
},[])

// password reset handler
const passwordResetHandler = async() =>{
  if (emailInput.isValid){
    const passwordRequestResult = await forgotPassword(emailInput.value);
    setError(passwordRequestResult);
  }
  else{
    setError('invalid email for request');
  }
}


// login submitter -> uses loginEmailHandler
const loginSubmitHandler = () =>{
  passwordInput.setTouch(true);
  emailInput.setTouch(true);
  if (isFormSignInValid){
   loginEmailHandler();
  }
}

// signUpHandler -> uses signUpEmailHandler
const signUpSubmitHandler = () =>{
  userNameInput.setTouch(true);
  emailInput.setTouch(true);
  passwordInput.setTouch(true);
  confirmPasswordInput.setTouch(true);
  
  if (isFormSignUpValid){
    signUpEmailHandler();
  }

}

// remember toglge
const rememberToggleHandler = () => setRemember(prev=>!prev);



// form submit handler (only using login/singup btn)
  const submitHandler = (event:React.FormEvent<HTMLFormElement>) =>{
    event.preventDefault();
    if (isLogin) loginSubmitHandler();
    else signUpSubmitHandler();
   
  }

 

  return (
    <Portal onClose={onClose}>
        <form onSubmit={submitHandler} className='h-screen overflow-hidden max-h-[500px] w-[90%] max-w-[400px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md
        text-primary_dark bg-white p-2 px-8 flex flex-col items-center gap-8'>


          <ul className={`flex relative justify-between  bg-primary bg-opacity-50 border-primary border-2 rounded-md text-primary
           after:w-1/2 after:bg-primary_btns after:absolute after:h-full after:rounded-md ${isLogin ? 'after:translate-x-0' : 'after:translate-x-full'} after:transition-transform `}>
            <li onClick={()=>{setIsLogin(true)}} className={`${isLogin ? 'text-white' : 'text-primary_dark '} cursor-pointer w-max px-4 py-2  z-10`}>Login</li>
            <li onClick={()=>{setIsLogin(false)}} className={`${isLogin ? 'text-primary_dark ' : 'text-white'} cursor-pointer w-max px-4 py-2 z-10`}>Sign Up</li>
          </ul>


      <section key={isLogin.toString()} className='flex flex-col gap-1 relative w-full animate-scaleUp'>
          
        <div className='flex flex-col gap-2 relative w-full'>

          <div className='flex flex-col gap-4'>

        {!isLogin &&  <SignUpAvatar updateAvatar={updateAvatarHandler}/>}

        {!isLogin && 
        <section className={`flex relative items-center border-2 rounded-md pr-2  ${userNameInput.hasError ? 'border-red-400 ' : ' border-gray-400'}`}>
          <input id='username' placeholder=''  className={`formInput peer border-none `} type='text' value={userNameInput.value} onChange={updateUserNameInput}/>
          <label htmlFor="username" className={`formInputLabel ${userNameInput.value.length>0 && 'formInputLabel_stay'}`}>Username</label>
        </section>
      }

        <section className='flex relative items-center'>
        <input  id='email'  placeholder=''  className={`formInput peer ${emailInput.hasError ? 'border-red-400' : ' border-gray-400'}`} type='email' value={emailInput.value} onChange={updateEmailInput}/>
        <label htmlFor="email" className={`formInputLabel ${emailInput.value.length>0 && 'formInputLabel_stay'}`}>Email</label>
        </section>

        <section className={`flex relative items-center border-2 rounded-md pr-2  ${passwordInput.hasError ? 'border-red-400 ' : ' border-gray-400'}`}>
          <input id='password' placeholder=''  className={`formInput peer border-none `} type={isPasswordShown ? 'text' : 'password'} value={passwordInput.value} onChange={updatePasswordInput}/>
          <label htmlFor="password" className={`formInputLabel ${passwordInput.value.length>0 && 'formInputLabel_stay'}`}>Password</label>
          <div onClick={togglePassowrdShown} className='flex items-center opacity-70'>
          {isPasswordShown ? <AiFillEyeInvisible/> : <AiFillEye/>}
         </div>
        </section>

      

      {!isLogin && 
        <section className={`flex relative items-center border-2 rounded-md pr-2  ${confirmPasswordInput.hasError ? 'border-red-400 ' : ' border-gray-400'}`}>
          <input id='confirmPassword' placeholder=''  className={`formInput peer border-none `} type={isPasswordShown ? 'text' : 'password'} value={confirmPasswordInput.value} onChange={updateConfirmPasswordInput}/>
          <label htmlFor="confirmPassword" className={`formInputLabel ${confirmPasswordInput.value.length>0 && 'formInputLabel_stay'}`}>Confirm Password</label>
          <div onClick={togglePassowrdShown} className='flex items-center opacity-70'>
          {isPasswordShown ? <AiFillEyeInvisible/> : <AiFillEye/>}
         </div>
        </section>
      }
          </div>

      
      {isLogin && <LoginAddons remember={remember} toggleRemember={rememberToggleHandler} passwordResetHandler={passwordResetHandler}/>}

        <button className='py-2 px-4
         bg-primary_btns text-primary rounded-md hover:bg-opacity-90'>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
        {error ? <p className='text-red-400 text-sm self-center'>{error}</p> : ''} 
        {isLoading ? <div className='w-full flex justify-center'><Spinner/> </div>  : ''}
        </div>

    

       <LoginWithOther googleLogin={googleLoginHandler}/>


       </section>

      
       <AiFillCloseCircle onClick={onClose} className='absolute right-2 top-2 text-2xl cursor-pointer'/>
        </form>
    </Portal>
  )
}

export default LoginForm