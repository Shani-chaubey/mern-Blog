import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from "../firebase";

export default function OAuth() {
    const auth = getAuth(app)
    const handleGoogleClick = async ()=>{
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({prompt: 'select_account'}); // Used to force account selection even if there
        try {
            const  resultFromGoogle = await signInWithPopup(auth, provider)
            console.log(resultFromGoogle)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Button type="button" gradientDuoTone="pinkToOrange" outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}