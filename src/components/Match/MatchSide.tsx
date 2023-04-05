'use client'
import React, { useState } from 'react'
import Image from 'next/image';
import MatchImage from './MatchImage';



const MatchSide:React.FC<{team:{name:string;logo:string;nickname:string};
status:string;percent:number;votes:number;didVote:boolean;wins:number|undefined;losses:number|undefined;side:string; matchId:number;voteFunction:(side:string,matchId:number)=>void}>
 = ({team,voteFunction,matchId,losses,wins,side,didVote,status,votes,percent}) =>{
  const [isImageLoading,setIsImageLoading] = useState(true);
  const voteHandler = () => voteFunction(side,matchId)

  return(
  <div className='grid grid-rows-[max-content,1fr,1fr]  items-center gap-2'>

    <div className='flex flex-col items-center gap-2 relative'>
      <section className=' h-16 w-16 md:h-24 md:w-24 relative'>
      <MatchImage className={'h-full w-full'} src={team.logo} alt={`logo ${team.nickname}`}/>
      </section>
    </div>

    <h2 className=' font-semibold text-center text-primary dark:text-primary_dark'>{team.name}</h2>

    <section className='flex gap-2 items-center justify-center'>
      <p className='text-green-400 dark:text-green-600'>{wins}<span className='ml-1'>W</span></p>
      <p className='text-red-400 dark:text-red-600'>{losses}<span className='ml-1'>L</span></p>
    </section>
    
    {!didVote && status!=='In Play' && status!=='Finished' &&
    <section onClick={voteHandler} className='p-2 bg-primary dark:bg-primary_dark text-primary_dark dark:text-primary w-fit mx-auto rounded-md cursor-pointer'>
      <p className='font-bold'>Vote</p>
    </section>
    }
    
    
    <section className='  flex p-1 rounded-md  flex-col items-center font-semibold'>
    {percent !==null&& <p> {percent}%</p>}
    {votes!==null &&<p>votes: {votes}</p>}
    </section>
</div>
)
}

export default MatchSide