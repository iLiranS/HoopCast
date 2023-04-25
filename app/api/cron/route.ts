import {doc , getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/src/firebase/base';
import { fullGameData, vote } from '@/src/Models/gameData';
import { NextResponse } from 'next/server';

type gameResult={
  id:string,
  home:string;
  visitors:string;
  result:string;
}
let result = '';
export const revalidate = 3600;


const fetchYesterdayGames = async(date:Date)=>{ // returns mapped games
  // Get yesterday date and returns game Object with this format : [ {id,home,visitors,result} ]
  const yesterday = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  let year = yesterday.getFullYear();
  let month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
  let day = yesterday.getDate().toString().padStart(2, '0');
  const validDate = year + '-' + month + '-' + day;
  result += 'Date : ' + validDate + ' , ';
  // api config
  const apiKey = process.env.NEXT_PUBLIC_NBA_API_KEY;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  }
  try{
    const response = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${validDate}`,options);
    const data = await response.json();
    const gamesList = data.response as fullGameData[];
    const resultsMapped = gamesList.filter(game=> game.status.long==='Finished').map((game)=>(
    {
      id:game.id,
      home:game.teams.home.name,
      visitors:game.teams.visitors.name,
      result:game.scores.home.points > game.scores.visitors.points ? 'home' : 'visitors'
    }));

    return resultsMapped;
  }
  catch(error){
    return error;
  }
}

const updateUser = async(vote:vote,game:gameResult) =>{ // updates user in firebase
  try{
    const userRef = doc(db, "users", vote.id);
    const userDocSnapshot = await getDoc(userRef);
    const userData = userDocSnapshot.data();
    // check if user already has predictions history
  if (!userData.predictions) {
    userData.predictions = { win: 0, lose: 0, history: [] };
  }
  // game data of the specific game
  
  // get and upate prediction result
  const prediction = vote.vote;
  const isCorrectPrediction = prediction === game.result;
  if (isCorrectPrediction)  userData.predictions.win += 1;
  else userData.predictions.lose += 1;
  //  update user predictions history.
  userData.predictions.history.push({
    home: game.home,
    visitors: game.visitors,
    predict: prediction,
    result: game.result,
  });
  // set updated doc
  await setDoc(userRef, userData);
}
catch(error){
  return error;
}
}

export  async function GET(){

  try{
        const today = new Date();
        const results = await fetchYesterdayGames(today);
        let clearedPredictions = 0;
        for (const game of results) {
            // get game ref inside predictions and userPredictions .
            const gameId = game.id.toString();
            const predictionsMatchRef = doc(db,'predictions',gameId);
            const predictionsRef = doc(db, "predictions", gameId.toString());
            const predictionsSnapshot = await getDoc(predictionsRef);
            const userPredictions = predictionsSnapshot.data()?.votes as vote[] || [];
            // check if empty
            if (userPredictions.length ===0) continue;
            // going through each prediction in Predictions.
            for (const vote of userPredictions) {
              clearedPredictions+=1;
              await updateUser(vote,game).catch((error)=>{throw error;});
            }
            // delete predictions of a match.
            await deleteDoc(predictionsMatchRef);
          }
          result += `, Cleared ${clearedPredictions} Predictions.`;
          return NextResponse.json({ response: result }, { headers: { 'Cache-Control': 'no-cache' } });
        }
  catch(error){
    console.error(error);
    return NextResponse.json({response:error});
  }
}