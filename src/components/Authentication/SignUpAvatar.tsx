import React, { useEffect, useState , useCallback } from 'react'
import Image from 'next/image';
import {AiOutlineReload} from 'react-icons/ai'
import MatchImage from '../Match/MatchImage';


function makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  
 const SignUpAvatar:React.FC<{updateAvatar:(avatar:string)=>void}> = ({updateAvatar}) => {
    const [avatar,setAvatar] = useState<null | string>(null);
    const [canReload,setCanReload] = useState(true);

  
    const generateAvatar = async()=>{
      if (!canReload) return;
      setAvatar(null);
      const randomId = makeid(10);
      // const response = await fetch(`https://api.multiavatar.com/${randomId}.png?apikey=${process.env.NEXT_PUBLIC_AVATAR_API}`);
    
        setAvatar(`https://api.multiavatar.com/${randomId}.png`)
        setCanReload(false);
    
      setTimeout(() => {
        setCanReload(true);
      }, 5000);
    }



    useEffect(()=>{
       generateAvatar();
    },[])

    useEffect(()=>{
        if (avatar) updateAvatar(avatar);
    },[avatar])



  return (
    <div className='h-10 w-full relative flex gap-4 justify-center items-center'>

      <section className='relative aspect-square h-12 rounded-full border-2 border-black'>
        {avatar && <MatchImage className={'h-full w-full rounded-full'} src={avatar} alt='avatar'/>}
       <AiOutlineReload onClick={generateAvatar} className={`absolute text-lg right-0 top-0 bg-white text-primary_dark rounded-full ${canReload ? 'opacity-100 cursor-pointer' : 'text-opacity-50 cursor-not-allowed'}`}/>
       
      </section>

     
    </div>
  )
}

export default React.memo(SignUpAvatar);