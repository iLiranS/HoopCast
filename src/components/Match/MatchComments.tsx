'use client'
import useInput from '@/src/hooks/useInput'
import React, { useState , useEffect , useRef } from 'react'
import {AiOutlineSend} from 'react-icons/ai'
import SingleComment from './SingleComment'
import { comment } from '@/src/Models/gameData'
import useAuthStore from '@/src/store/useAuthStore'
import Alert from '../Ui/Alert'

const MatchComments:React.FC<{comments:comment[],matchId:string}> = ({comments,matchId}) => {
    const user = useAuthStore((state)=> state.currentUser);
    const [alertMessage,setAlertMessage] = useState(null);
    const [isCommentResultLoading,setIsCommmentResultLoading] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);
    const validateCommentInput = (input:string) =>{
        if (input.trim().length >0 && input.trim().length < 450) return true;
        return false;
    }
    
    const commentInput = useInput({validateInput:validateCommentInput});
    const updateCommentInputHandler = (event:React.ChangeEvent<HTMLInputElement>) => {commentInput.updateInput(event.target.value); commentInput.setTouch(false)}


    const postMessageToFireBase = async()=>{
      // need  matchId, userId,userAvatar,userName, comment
      try{
        setIsCommmentResultLoading(true);
        const response = await fetch('/api/addcomment', {
          method: 'POST',
          body: JSON.stringify({ matchId:matchId, userId: user.uid,userAvatar:user.photoURL,userName:user.displayName,comment:commentInput.value}),
          headers: {
          'Content-Type': 'application/json',
        },});
        if (!response.ok){
          throw new Error('comment post failed');
        }
        const data = await response.json();
        // error handlers :
        if (data.response === 'invalid request'){
          throw new Error('Invalid request!');
        }
         if ( data.response === 'Comment added successfully'){
          commentInput.setText('');
           setAlertMessage('Comment added !');
           setTimeout(() => {
            setIsCommmentResultLoading(false);
           }, 5000); 
          return;
        }
        if(data.response === 'Comment too long'){
           setAlertMessage('comment too long!');
          return;
        }
      }
      catch(error){
        console.error(error);
        setAlertMessage(error.message);
      }
      setTimeout(() => {
        setIsCommmentResultLoading(false);
      }, 5000);
    }


    const sendMessageHandler = (event:React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        commentInput.setTouch(true);
        if (!user){
          setAlertMessage('Login to comment!');
          return;
        }
        if (isCommentResultLoading){
          setAlertMessage('message sent is loading...');
          return;
        }
        //
        if(commentInput.isValid){
          postMessageToFireBase();
          commentInput.setTouch(false);
        }
       
        else{
          setAlertMessage('Message invalid !')
        }

    }

    useEffect(()=>{
      if (listRef.current){
        listRef.current.scrollTop = listRef.current.clientHeight;
      }
    },[listRef])

    const commentsMapped = comments ?  comments.map((commentObject , index) => <SingleComment key={index} comment={commentObject}/> ) : '';

  return (
    <section className='grid grid-rows-[max-content,auto,max-content] h-[500px] overflow-hidden dark:bg-primary p-4 rounded-md
    bg-primary_dark text-primary dark:text-primary_dark gap-3'>

      <li className='font-semibold list-none h-4'>Comments :</li>
    <ul ref={listRef} className=' scroll-smooth flex flex-col gap-2 h-[400px] justify-start overflow-y-auto'>
      {commentsMapped}
    </ul>

    <form onSubmit={sendMessageHandler} className='h-10 rounded-md grid grid-cols-[auto,max-content] gap-2'>
    <section className='flex relative items-center bg-primary_dark dark:bg-primary  bg-opacity-20 dark:bg-opacity-20'>
        <input  id='commentInput'  placeholder=''  className={`formInput peer ${commentInput.hasError ? 'border-red-400' : ' border-gray-400'} text-primary_dark`} type='text' value={commentInput.value} onChange={updateCommentInputHandler}/>
        <label htmlFor="commentInput" className={` formInputLabel bg-inherit ${commentInput.value.length>0 && 'formInputLabel_stay'} rounded-md text-primary_dark`}>Comment</label>
        </section>
        <button className='w-max dark:hover:text-primary_btns hover:text-green-400'><AiOutlineSend className='text-xl'/></button>
    </form>

    {alertMessage && <Alert onClose={()=>{setAlertMessage(null)}} message={alertMessage}/>}
      </section>
  )
}

export default MatchComments