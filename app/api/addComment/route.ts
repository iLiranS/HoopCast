import { db } from '../../../src/firebase/base'
import { getDoc,doc,updateDoc,arrayUnion } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = await request.json();
  const { matchId, userId, userAvatar, userName, comment } = res;

  try {
    // Validate comment length
    if (comment.length > 450) return NextResponse.json({ response: 'Comment too long' }, { status: 409 });

    if (!matchId || !userId || !userAvatar || !userName || !comment)
      return NextResponse.json({ response: 'Invalid request' }, { status: 409 });

    // Get match doc reference
    const matchRef = doc(db, 'matches', matchId.toString());

    // Update match doc with new comment
    await updateDoc(matchRef, {
      comments: arrayUnion({ comment, user: { avatar: userAvatar, name: userName, id: userId } }),
    });

    return NextResponse.json({ response: 'Comment added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ response: 'Failed adding comment.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('id');

  try {
    const matchDocRef = doc(db, 'matches', matchId.toString());
    const matchDocSnapshot = await getDoc(matchDocRef);

    if (!matchDocSnapshot.exists()) {
      return NextResponse.json({ error: 'match not found' }, { status: 404 });
    }

    const comments = matchDocSnapshot.get('comments') || [];

    console.log(comments);
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

  
  
  
  
  