import { auth, app } from "./firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";

const db = getFirestore(app)


// Function to create a new user with email and password
export const createUser = async (email, password, username) => {
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Update the user's profile with the username
      await updateProfile(user, {
        displayName: username,
      });
  
      // Send email verification
      await sendEmailVerification(user);

      Alert.alert('Verification Email Sent\nVerify and Reopen App!')
  
      // Store username in Cloud Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        followers:0,
        aboutMe:'',
        pfpURL:'',
        // ... other user data if needed
      });
  
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      
      if(error.code === 'auth/email-already-in-use'){
        
        Alert.alert('Email Address is already in use')
        return null
        
      }
      else if(error.code === 'auth/weak-password') {
        Alert.alert('Password is too weak')
      }
      else{
        Alert.alert('An error occured. Pls try again later')
        return null
      }
    }
  };