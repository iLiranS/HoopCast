import { db } from '../../../src/firebase/base'
import { collection ,addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log(request);
    const res = await request.json();
    const { matchId, userId,userAvatar,userName, comment } = res
    const date = new Date().getTime();

    
    
    try {
      //validate comment length
      if (comment.length > 450) return NextResponse.json({response:'Comment too long'},{status:409});

      if (!matchId || !userId || !userAvatar || !userName || !comment) return NextResponse.json({response:'invalid request'},{status:409});
        // get comment ref
        const matchCommentsRef = collection(db, 'matches', matchId.toString(), 'comments');    
        // add comment
        const newComment = { comment: comment, user: { avatar: userAvatar, name: userName, id: userId },timestamp:date };
        await addDoc(matchCommentsRef, newComment);
        return NextResponse.json({ response: 'Comment added successfully' },{status:200});           
    
    }
     catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({response:'Failed adding comment.'},{status:500});
    }
    
  }