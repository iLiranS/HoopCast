import { NextResponse } from 'next/server';
import {createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import {auth} from '../../../src/firebase/base'
import sanitize from 'sanitize-html';
import validator from 'validator';




export async function POST(request: Request) {
    const res = await request.json();
    const {email,password,photoURL,username} = res;
    // need to sanitize check first .
    const sanitizedEmail = sanitize(email);
    const sanitizedPhotoURL = sanitize(photoURL);
    const sanitizedUserName = sanitize(username);

    const validateEmail = (email:string) => {
        return validator.isEmail(email);
    }
    const validatePhoto = (photo:string) =>{
        return validator.isURL(photo);
    }
    const validateUserName = (userName:string) =>{
        return validator.isLength(userName,{min:2,max:30});
    }
 


    try{
        if (!validateEmail(sanitizedEmail) || !validatePhoto(sanitizedPhotoURL) || !validateUserName(sanitizedUserName)) {
            return NextResponse.json({message:'validation failed'},{status:409});
        }
        const userCrendtial = await createUserWithEmailAndPassword(auth,email,password);
        if (userCrendtial && userCrendtial.user){
            await updateProfile(userCrendtial.user,{displayName:username,photoURL})
            return NextResponse.json({message:'successfully registered'},{status:200});
        }
        else{
            return NextResponse.json({message:'error!'},{status:400})
        }
        
    }
    catch(error){
        return NextResponse.json({message:error ?? 'error'},{status:409});
    }
    
  }
  