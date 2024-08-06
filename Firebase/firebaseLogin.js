import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from './firebaseConfig'
import { Alert } from "react-native";
// Function to sign in an existing user with email and password
export const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error('Error signing in:', error);
      if(error.code === 'user-not-found'){
        Alert.alert('No user found with that Email')
      }
      else if(error.code === 'auth/wrong-password'){
        Alert.alert('Incorrect Password')
      }
      else if(error.code === 'auth/invalid-credential'){
        Alert.alert('Invalid Credentials')

      }
      else if(error.code === 'auth/too-many-requests') {
        Alert.alert('Too many attempts. Pls try again later')
      }
    }
  };