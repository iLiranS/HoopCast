import React from 'react'
import Image from 'next/image';






const ProfilePage:React.FC<{avatar:string;name:string;predictions:any}> = ({avatar,name,predictions}) => {

const historyMapped = predictions.history ?  predictions.history.map((match,index) =>(
<li key={index} className={`flex items-center p-2 gap-2 justify-center border-2 rounded-md ${match.result ===match.predict ? 'border-green-400 bg-green-400 bg-opacity-10' : 'border-red-400 bg-red-400 bg-opacity-10'}`}>
    <p className={`${match.predict==='home' ? ' font-bold' : ' opacity-75'}`}>{match.home}</p>
    <p>vs</p>
    <p className={`${match.predict==='visitors' ? ' font-bold' : ' opacity-75'}`}>{match.visitors}</p>
</li>)) : 'no history yet'


  return (
    <div className='flex flex-col relative pt-12 gap-4 h-full'>

        <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
        <h2 className='text-2xl'>{name}</h2>
        <section className='relative h-32 aspect-square border-2 box-content rounded-full  border-primary_dark dark:border-primary'>
        <Image  layout='fill' objectFit='cover' className='rounded-full aspect-square' alt='userAvatar' src={avatar}/>
        </section>
        <div className='flex items-center gap-4 w-max self-center p-2 rounded-md bg-primary_dark dark:bg-primary dark:bg-opacity-20 bg-opacity-80'>
            <p className='text-green-400 tracking-wider'>W : {predictions.win ?? '0'}</p>
            <section>|</section>
            <p className='text-red-400 tracking-wider'>L: {predictions.lose ?? '0'}</p>
        </div>
        
        </div>

        <ul className='w-full max-w-[500px] self-center flex flex-col gap-2 px-2 md:px-0'>
            <li>
            <h2>History :</h2>
            </li>
            {historyMapped}
        </ul>


    </div>
  )
}

export default ProfilePage