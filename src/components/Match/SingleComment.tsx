'use client'
import { comment } from '@/src/Models/gameData';
import React, { useEffect, useRef, useState } from 'react'
import {MdOutlineExpandMore} from 'react-icons/md'
import MatchImage from './MatchImage';
import { useRouter } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';



const SingleComment:React.FC<{comment:comment}> = ({comment}) => {
    const [expand,setExpand] = useState(false);
    const [hasReadMore,setHasReadMore] = useState(false);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const router = useRouter();

    const sanitizedComment = sanitizeHtml(comment.comment);
    const sanitizedImage = sanitizeHtml(comment.user.avatar);
    const sanitizedName = sanitizeHtml(comment.user.name);
  
  
    useEffect(()=>{
      if(!paragraphRef.current)return;
      if (paragraphRef.current.offsetHeight > 40) {
        setHasReadMore(true);
          }

    },[paragraphRef])

        const expandHandler = () => setExpand(prev => !prev);
        const redirectToProfile = () => router.push(`/profile/${comment.user.id}`);

  return (
<li className={`w-full relative p-2 gap-2  bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md grid grid-cols-[max-content,auto,max-content]`} style={{ maxHeight: expand ? '400px' : '40px', transition: 'max-height 0.5s ease-in-out' }}>
   
    <section onClick={redirectToProfile} className='flex max-h-full  cursor-pointer overflow-hidden h-8  items-center w-fit gap-1 bg-primary dark:bg-primary_dark bg-opacity-10 dark:bg-opacity-10  p-1 rounded-md'>
        <MatchImage className={'h-8 aspect-square overflow-hidden rounded-full'} src={sanitizedImage} alt={comment.user.name}/>
        <p className=''>{sanitizedName}</p>
    </section>

    <section className='relative pt-1 h-full overflow-hidden'>
    <p   ref={paragraphRef} className={`h-max w-full `}>
      {sanitizedComment}
    </p>
    </section>
    
  {hasReadMore && <section onClick={expandHandler} className='w-fit rounded-md h-fit grid place-items-center text-2xl cursor-pointer bg-opacity-80 bg-primary_dark dark:bg-opacity-20 z-10'><MdOutlineExpandMore className={`${expand ? 'rotate-180' : 'rotate-0'} transition-all`}/></section>}

</li>
  )
}

export default SingleComment