'use client'
import { convertUTCToLocalTime, gamesData, predictionsData } from '@/src/Models/gameData'
import useAuthStore from '@/src/store/useAuthStore';
import React, { useState , useMemo } from 'react'
import MatchSide from './MatchSide';
import Alert from '../Ui/Alert';
import MatchComments from './MatchComments';
import Link from 'next/link';



const MatchPage:React.FC<{game:gamesData;predictionsData:predictionsData}> = ({game,predictionsData}) => {
     const {date , points , scores , status , teams, comments , id} = game;
     const [didVote,setDidVote] = useState(false);
     const [showAlert, setShowAlert] = useState(false);
     const [alertMessage,setAlertMessage] = useState('');
     const currentUser = useAuthStore((state)=>state.currentUser)

      const closeAlert = () => setShowAlert(false);
     
    const votePredict = async (side: string, matchId: number) => {
      if (didVote){
        setShowAlert(true);
        setAlertMessage('already voted!');
        return;
      }
      if (!currentUser){
       setShowAlert(true);
       setAlertMessage('Login to vote !');
        return;
      }
      try{
        const response = await fetch('/api/addprediction', {
          method: 'POST',
          body: JSON.stringify({ matchId, userId: currentUser.uid, team:side }),
          headers: {
          'Content-Type': 'application/json',
        },});
        if (!response.ok){
          console.log(response);
          throw new Error('prediction post failed');
        }
        const data = await response.json();
        if (data.response === 'User already voted for this match') {
          setDidVote(true);
          setShowAlert(true);
          setAlertMessage('Already Voted')
        }
        if(data.response === 'Prediction added successfully'){
          setDidVote(true);
          setShowAlert(true);
          setAlertMessage(data.response)
        }
      }
      catch(error){
      setShowAlert(true);
      setAlertMessage('error');
      } 
    };

    const percentages = useMemo(()=>{
      if (!predictionsData) return;
      const homePercent = Math.round(predictionsData.home / predictionsData.total * 100);
      const visitorsPercent = Math.round(predictionsData.visitors / predictionsData.total * 100);
      return({home:homePercent,visitors:visitorsPercent})
    },[predictionsData])
    
    


  return (
    <div className='h-full px-1 md:px-0 w-full max-w-[600px] mx-auto flex flex-col  relative pt-12 gap-2 pb-8'>
      <Link className='items-center p-1 dark:bg-primary bg-primary_dark bg-opacity-10 dark:bg-opacity-10 rounded-md w-fit  flex gap-1' href={'/'}> <p>Go Back</p></Link>
      <div className='dark:bg-primary p-4 rounded-md rounded-b-none
        bg-primary_dark text-primary dark:text-primary_dark'>

        <section className=' w-full justify-center grid grid-cols-[3fr,1fr,3fr] '>
          <MatchSide votes={predictionsData? predictionsData.home : 0} percent={percentages ? percentages.home : null}  status={game.status.long} didVote={didVote} voteFunction={votePredict} matchId={game.id} side='home' team={teams.home} wins={scores.home.win} losses={scores.home.lose}/>

            <section className='flex flex-col items-center justify-center bg-primary bg-opacity-10 dark:bg-primary_dark h-fit my-auto rounded-md p-1 relative'>
              {game.status.long==='Scheduled' ? <p className='text-primary'>{convertUTCToLocalTime(game.date)}</p> : 
               <div className='flex items-center w-max'>
                <p className={`${game.points.home > game.points.visitors ? 'text-green-400' : 'text-red-400'}  w-10 text-center dark:bg-opacity-50 rounded-md  font-bold`}>{game.points.home}</p>
                <p className='font-extrabold text-primary'>-</p>
                <p className={`${game.points.home > game.points.visitors ? 'text-red-400' : 'text-green-400'}  w-10 text-center dark:bg-opacity-50 rounded-md  font-bold`}>{game.points.visitors}</p>
              </div>
              }
             <p className={`text-xs absolute -bottom-4  h-min  w-min self-center ${game.status.long==='In Play'? ' text-rose-500' : 'text-primary dark:text-primary_dark'}`}>{game.status.long}</p>
             
            </section>

            <MatchSide votes={predictionsData? predictionsData.visitors :0} percent={percentages ? percentages.visitors : null} status={game.status.long} didVote={didVote} voteFunction={votePredict} matchId={game.id} side='visitors' team={teams.visitors} wins={scores.visitors.win} losses={scores.visitors.lose}/>
        </section>

             
              </div>

               
                <MatchComments matchId={id.toString()} comments={comments?? null}/>

              


              {showAlert && <Alert message={alertMessage} onClose={closeAlert}/>}
    </div>
  )
}




export default MatchPage