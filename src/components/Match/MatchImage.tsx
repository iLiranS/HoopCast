'use client'
import React, { useState } from 'react'
import Image from 'next/image';

// need to get height and width via tailwind class
const MatchImage:React.FC<{alt:string;src:string;className:any}> = ({alt,src,className}) => {
    const [isImageLoading,setIsImageLoading] = useState(true);
  return (
    <section className={`${className} relative  `}>
     {isImageLoading && <div className='absolute h-full w-full bg-gray-700 animate-pulse rounded-full'></div>}
    <Image onError={()=>{setIsImageLoading(false);}} onLoad={()=>{setIsImageLoading(false)}} fill sizes='100% 100%'  alt={alt} src={src}/>
    </section>

  )
}

export default MatchImage