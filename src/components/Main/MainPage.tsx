import { convertUTCToLocalTime, gamesData } from '@/src/Models/gameData';
import Image from 'next/image';
import React from 'react'
import MatchImage from '../Match/MatchImage';
import Link from 'next/link';




  


const MainPage:React.FC<{games:gamesData[]}> = ({games}) => {
  
   const mappedGames = games.map((game,index) =>(
       <Link  key={index} href={`/match/${game.id}`}>
       <li className='grid  grid-cols-[3fr,1fr,3fr] cursor-pointer p-2 h-max rounded-md dark:border-primary dark:border-opacity-10 border-opacity-10 border-2 w-full md:w-[500px] gap-2 md:gap-4 overflow-hidden border-primary_dark
        bg-primary_dark dark:bg-primary bg-opacity-10 dark:bg-opacity-10 ' key={index}>
       
        <section  className='flex items-center justify-start relative h-full w-full '>
        <div dir='rtl' className=' items-center relative h-10 md:h-12 w-full gap-1 md:gap-4 grid grid-cols-[max-content,4fr]'>
                <MatchImage className={'w-8 md:w-10 aspect-square md:h-full'} src={game.teams.home.logo} alt={game.teams.home.nickname}/>
                <p className='font-semibold text-sm md:text-base overflow-hidden overflow-ellipsis whitespace-nowrap w-full'>{game.teams.home.nickname}</p>
            </div>
        </section>

        <section className='p-2 w-full text-primary flex flex-col relative' >
            {game.status.long==='Scheduled' ? <p className='dark:text-primary text-primary_dark'>{convertUTCToLocalTime(game.date)}</p> : 
          <div className='flex items-center'>
            <p className={`${game.points.home > game.points.visitors ? 'dark:text-green-400  text-green-500' : 'dark:text-red-400  text-red-500'}   text-center dark:bg-opacity-50 rounded-md  font-bold`}>{game.points.home}</p>
            <p className='text-primary_dark dark:text-primary'>-</p>
            <p className={`${game.points.home > game.points.visitors ? 'dark:text-red-400  text-red-500' : 'dark:text-green-400  text-green-500'}   text-center dark:bg-opacity-50 rounded-md  font-bold`}>{game.points.visitors}</p>
             </div>
             }
             <p className={`text-xs absolute -bottom-1  h-min  w-min self-center ${game.status.long==='In Play'? ' text-rose-500' : 'text-primary_dark dark:text-primary'}`}>{game.status.long === 'In Play' ? 'live' : game.status.long}</p>
            </section>

        <section className='flex items-center justify-start relative h-full w-full'>
            <div className=' items-center relative h-10 md:h-12 w-full gap-1 md:gap-4 grid grid-cols-[max-content,4fr]'>
                <MatchImage className={'w-8 md:w-10 aspect-square'} src={game.teams.visitors.logo} alt={game.teams.visitors.nickname}/>
                <p className='font-semibold text-end text-sm md:text-base overflow-hidden overflow-ellipsis whitespace-nowrap w-full'>{game.teams.visitors.nickname}</p>
            </div>
        </section>
   </li>
             </Link>
   ))






  return (
    <ul className='relative flex flex-col w-full max-w-[500px]  px-2 md:px-0  mx-auto gap-2 pt-4 md:pt-12 items-center  pb-2'>
        <li className='font-semibold'>Today&apos;s Matches :</li>
        {mappedGames}
    </ul>
  )
}

export default MainPage