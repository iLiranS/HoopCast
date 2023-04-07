import { Inter } from 'next/font/google'
import MainPage from '@/src/components/Main/MainPage';
import {doc , collection , getDocs , getDoc, setDoc, deleteDoc , updateDoc} from 'firebase/firestore'
import { db } from '@/src/firebase/base';
import { gamesData, vote } from '@/src/Models/gameData';

const inter = Inter({ subsets: ['latin'] })

export const revalidate = 960; // 960 = every 16mins  = 90 per day.

const getUpdatedGame = async()=>{
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const validDate = year + '-' + month + '-' + day;
  const apiKey = process.env.NEXT_PUBLIC_NBA_API_KEY;
  const options = {
    method: 'GET',
    headers: {
		  'X-RapidAPI-Key': apiKey,
		  'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
	  }
  }
  // get updated games.
 try {
  const response = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${validDate}`, options);
  const data = await response.json();
  return data;
 }
  catch (err) {
  console.error(err);
  return null;
 }
}

// for the dummy data.
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

// dummy games data.
const getGames = async()=>{
  try {
    const data = await readFileAsync('dummydata.txt', 'utf8');
    return data;
  } catch (err) {
    console.error(err);
  }
}

// this function takes a list of games , checks if status finished , updates user predictions and delete prediction.
const updatePredictionsOfFinishedGames = async (games: gamesData[]) => {
  const finishedGames = games.filter(game => game.status.long==='Finished');
  if (finishedGames.length<1) return true;
  try {
    for (const game of finishedGames) {
      // get game ref inside predictions and userPredictions .
      const gameId = game.id.toString();
      const predictionsMatchRef = doc(db,'predictions',gameId);
      const predictionsRef = doc(db, "predictions", gameId.toString());
      const predictionsSnapshot = await getDoc(predictionsRef);
      const userPredictions = predictionsSnapshot.data()?.votes as vote[] || [];
      // check if empty
      if (userPredictions.length ===0) return true;

      // going through each prediction in Predictions.
      for (const vote of userPredictions) {
        const userRef = doc(db, "users", vote.id);
        const userDocSnapshot = await getDoc(userRef);
        const userData = userDocSnapshot.data();

        // check if user already has predictions history
        if (!userData.predictions) {
          userData.predictions = { win: 0, lose: 0, history: [] };
        }
        // game data of the specific game
        const gameData = {
          home: game.teams.home.name,
          visitors: game.teams.visitors.name,
          result: game.points.home > game.points.visitors ? "home" : "visitors",
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

    return true;
  } catch (error) {

    console.error('error updating predictions',error);
    return false;
  }
};









const updateFireStoreMatches = async(games:gamesData[])=>{
  try{
    const matchesRef = collection(db, "matches");
    const existingMatchesSnapshot = await getDocs(matchesRef);

    // Check if the "matches" collection exists and has any documents
    if (existingMatchesSnapshot.size > 0) {
      const existingMatches = existingMatchesSnapshot.docs.map(doc => doc.data() as gamesData);
      // Check if the existing matches are the same as the new matches
      const areMatchesEqual =  existingMatches[0].id === games[0].id;
      if (!areMatchesEqual){
        // Delete all existing matches and add the new ones
        for (const doc of existingMatchesSnapshot.docs) {
          await deleteDoc(doc.ref);
        }
        for(const game of games){
          const docRef = doc(matchesRef,game.id.toString());
          await setDoc(docRef,game);
        }
        return true;
      }
      // If the existing matches are the same as the new matches, just merge to get updated status
      for (const game of games){
        const docRef = doc(matchesRef,game.id.toString());
        await setDoc(docRef, game, { merge: true });
      }
      return true;
    } else {
      // If the "matches" collection doesn't exist yet, add the new games
      for(const game of games){
        const docRef = doc(matchesRef,game.id.toString());
        await setDoc(docRef,game);
      }
      return true;
    }
  }
  catch(error){
    return false;
  }
}



export default async function Home() {


  try {
    const games = await getUpdatedGame();
    const response = games.response;
    // const games = await getGames();
    // const gamesJSON = JSON.parse(games);
    // const response = gamesJSON.response;

    const mappedGames = response.map(game =>({
      id:game.id,
      date:game.date.start,
      status: {clock:game.status.clock , long:game.status.long},
      teams:{
        home:{name:game.teams.home.name , logo:game.teams.home.logo , nickname: game.teams.home.nickname},
        visitors:{name:game.teams.visitors.name , logo:game.teams.visitors.logo , nickname: game.teams.visitors.nickname}
      },
      scores:{
        home:{win:game.scores.home.win , lose:game.scores.home.loss},
        visitors:{win:game.scores.visitors.win , lose:game.scores.visitors.loss}
      },
      points:{
        home:game.scores.home.points,
        visitors:game.scores.visitors.points
      }
    }))
    // const updateFinishedGames = await updatePredictionsOfFinishedGames(mappedGames);
    const updatedFireBase = await updateFireStoreMatches(mappedGames);
    if(!updatedFireBase) throw new Error('failed fetching');
    return (
      <>
        <MainPage games={mappedGames} />
      </>
    )
  }
  
  
  
  
  catch (err) {
    console.error(err);
  }
  return <div>Error</div>

 
}

