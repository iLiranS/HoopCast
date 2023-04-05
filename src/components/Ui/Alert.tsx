'use client'
import React from 'react'

import { useState, useEffect } from 'react';

const Alert:React.FC<{onClose:()=>void;message:string}> = ({onClose,message}) =>{

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose,message]);

  

  return (
    <div key={message} className='flex fixed z-30 top-14 right-4 w-[200px] bg-primary_btns dark:bg-primary_dark_btns p-2 dark:text-primary_dark text-white rounded-md text-sm animate-alertPopOut'>
      <p>{message}</p>
    </div>
  );
}

export default Alert;