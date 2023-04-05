import { db } from '../../../src/firebase/base'
import { collection , doc , setDoc , getDoc, updateDoc , arrayUnion, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';





export async function POST(request: Request) {
    const res = await request.json();
    const { matchId, userId, team } = res
    console.log(matchId,userId,team)



   // create a reference to the predictions collection
    const predictionsRef = collection(db, 'predictions');

  // create a reference to the document with the matchId
  const matchPredictionsRef = doc(predictionsRef, matchId.toString());

  try {
    // check if matchId is defined before calling toString
   if (!matchId || !userId || !team)  return NextResponse.json({ response: 'Missing Parameters!' },{status:400});
    
    // check if match document already exists
    const matchDoc = await getDoc(matchPredictionsRef);
    if (matchDoc.exists()) {
      // get the existing votes array
      const votes = matchDoc.data().votes;

      // check if user already voted
      const userVote = votes.find((vote) => vote.id === userId);
      if (userVote) return NextResponse.json({ response: 'User already voted for this match' },{status:409});

      // add the new vote to the votes array
      const newVote = { id: userId, vote: team };
      await updateDoc(matchPredictionsRef, { votes: [...votes, newVote] });
      return NextResponse.json({ response: 'Prediction added successfully' },{status:200});
    }

  else
  {
    // create a new match document with the new vote
    const newMatch = { votes: [{ id: userId, vote: team }] };
    await setDoc(matchPredictionsRef, newMatch);
    return NextResponse.json({ response: 'Prediction added successfully' },{status:200});
  }

} catch (error) {
  console.error('Error adding prediction:', error);
  return NextResponse.json({ response: 'Failed Posting data.' },{status:500});
}
  }