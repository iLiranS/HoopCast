import MainPage from '@/src/components/Main/MainPage';
import {doc , collection , getDocs, setDoc, deleteDoc} from 'firebase/firestore'
import { db } from '@/src/firebase/base';
import { gamesData } from '@/src/Models/gameData';



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
    headers:
     {
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
    const response:any[] = games.response;
    if (response.length ===0){
      return <p className='text-center'>No Games today.</p>
    }
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

