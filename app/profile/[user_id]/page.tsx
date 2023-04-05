import React from 'react'
import { db } from '@/src/firebase/base'
import {  doc, getDoc , collection , getDocs, QueryDocumentSnapshot} from 'firebase/firestore';
import { notFound } from 'next/navigation';
import ProfilePage from '@/src/components/Profile/ProfilePage';

export const dynamicParams = false;
export const dynamic = 'force-static';

export const metadata = {
    title:'HoopCast - Profile',
  }

const getProfileData = async(id:string) =>{
    try{
        const userRef = doc(db,'users',id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()){
            const userData = userDoc.data();
            return userData ?? {win:0,lose:0,history:[]};
        }
        else{
            return null;
        }
    }
    catch(error){
        return false;
    }
}
export async function generateStaticParams(){
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);

    const paths = usersSnapshot.docs.map((doc:QueryDocumentSnapshot)=>({user_id : doc.id}))
    return paths;
}



const page = async({params}:{params:{user_id:string}}) => {
    const profileId = params.user_id;
    const profileData = await getProfileData(profileId);
    if (!profileData) notFound();
  


  return (
    <ProfilePage avatar={profileData.avatarUrl} name={profileData.name} predictions={profileData.predictions ?? []} />
  )
}

export default page