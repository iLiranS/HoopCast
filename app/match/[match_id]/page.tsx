import { db } from '@/src/firebase/base';
import { collection, doc , getDocs , getDoc , QueryDocumentSnapshot} from 'firebase/firestore';
import MatchPage from '@/src/components/Match/MatchPage';
import { gamesData, predictionsData , vote } from '@/src/Models/gameData';

export const dynamicParams = false;
export const metadata = {
    title:'HoopCast - Match',
    description: 'Match page of HoopCast',
  }


const getMatchData = async(id:string) =>{
    try{
        const matchRef = doc(db,'matches',id);
        const matchDoc = await getDoc(matchRef);
        if (matchDoc.exists()){
            const matchData = matchDoc.data();
                return matchData            
        }
        else{
            return null;
        }
    }
    catch(error){
        return false;
    }
}
const getPredictionsData = async(id:string)=>{
    try {
        const userPredictionsRef = doc(db, "predictions", id);
        const userPredictions = await getDoc(userPredictionsRef); // { votes : [ {id,vote} , {...} ]}
        if (!userPredictions.data()) return undefined;
        const votes = userPredictions.data().votes as vote[] // [ {id : '' , vote:''} ,...]
        const homeTotal = votes.filter(vote => vote.vote==='home').length;
        const visitorsTotal = votes.length - homeTotal;
        return { total : homeTotal+visitorsTotal , home:homeTotal,visitors:visitorsTotal}
       
      } catch (error) {
        console.error("Error getting user predictions:", error);
        return null;
      }
}


export async function generateStaticParams(){
    const matchesCollectionRef = collection(db, 'matches');
    const matchesSnapshot = await getDocs(matchesCollectionRef);

    const paths = matchesSnapshot.docs.map((doc:QueryDocumentSnapshot)=>({match_id : doc.id}))
    return paths;
}




const page =  async({params}:{params:{match_id:string}}) => {
    const matchData = await getMatchData(params.match_id);
    const gameData = matchData as gamesData;
    const predictionsData: predictionsData = await getPredictionsData(params.match_id);

    
  return (
        <MatchPage predictionsData={predictionsData} game={gameData}/>
  )
}

export default page