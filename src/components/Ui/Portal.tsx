import React from 'react'
import ReactDOM from 'react-dom';

const Portal = (props:any) => {



    const content = 
    // main container
    <div onClick={props.onClose} className='fixed w-screen h-[100dvh] z-30 top-0'> 
    {/* background dark */}
    <div className='absolute h-full w-full top-0 bg-black bg-opacity-70'></div>
    {/* content , here the children will be placed */}
    <section className='z-50'  onClick={(e)=>e.stopPropagation()}>
    {props.children}
    </section>
    </div>


    const coverElement = document.getElementById('cover');
    if(!coverElement) return null;

    return ReactDOM.createPortal(content,coverElement);
    // create in index html file another div beside the main one.
}

export default Portal