import {doc , getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/src/firebase/base';
import { vote } from '@/src/Models/gameData';

export default async function handler(req,res){
    // Get yesterday date
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  let year = yesterday.getFullYear();
  let month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
  let day = yesterday.getDate().toString().padStart(2, '0');
  const validDate = year + '-' + month + '-' + day;
  // api config
  const apiKey = process.env.NEXT_PUBLIC_NBA_API_KEY;
  const options = {
    method: 'GET',
    headers: {
		  'X-RapidAPI-Key': apiKey,
		  'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
	  }
  }
  // fetch games of yesterday
  try{
    const response = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${validDate}`, options);
    const data = await response.json();
    const resultsAndIdMapped = data.map(game=>({id:game.id,
        home:game.teams.home.name , visitors:game.teams.visitors.name,
        result:game.scores.home.points >game.scores.visitors.points ? 'home' : 'visitors' }));
        console.log(resultsAndIdMapped);
        let clearedPredictions = 0;
        for (const game of resultsAndIdMapped) {
            // get game ref inside predictions and userPredictions .
            const gameId = game.id.toString();
            const predictionsMatchRef = doc(db,'predictions',gameId);
            const predictionsRef = doc(db, "predictions", gameId.toString());
            const predictionsSnapshot = await getDoc(predictionsRef);
            const userPredictions = predictionsSnapshot.data()?.votes as vote[] || [];
            // check if empty
            if (userPredictions.length ===0) { res.status(200).send('Done, ' + 'cleared ' +'0 predictions');
            ; return;};
      
            // going through each prediction in Predictions.
            for (const vote of userPredictions) {
                clearedPredictions+=1;
              const userRef = doc(db, "users", vote.id);
              const userDocSnapshot = await getDoc(userRef);
              const userData = userDocSnapshot.data();
      
              // check if user already has predictions history
              if (!userData.predictions) {
                userData.predictions = { win: 0, lose: 0, history: [] };
              }
              // game data of the specific game
              const gameData = {
                home: game.home,
                visitors: game.visitors,
                result: game.result
              };
              // get and upate prediction result
              const prediction = vote.vote;
              const isCorrectPrediction = prediction === gameData.result;
              if (isCorrectPrediction)  userData.predictions.win += 1;
               else userData.predictions.lose += 1;
              //  update user predictions history.
              userData.predictions.history.push({
                home: gameData.home,
                visitors: gameData.visitors,
                predict: prediction,
                result: gameData.result,
              });
              // set updated doc
              await setDoc(userRef, userData);
            }
            // delete predictions of a match.
            await deleteDoc(predictionsMatchRef);
          }
          res.status(200).send('Done, ' + 'cleared  ' + clearedPredictions + ' predictions');

  }
  catch(error){
    console.error(error);
    res.status(500).send('Failed Clearing Predictions')
  }
}