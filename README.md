# 🎑📖Pictorica - Where Every Picture Tells a Story!📖🎑

<p align="center">
  <img src="https://github.com/user-attachments/assets/5875cf4d-d407-4fef-b3b2-01aaf63e32cf"  width="354" height="629">
</p>

**Pictorica - Where Every Picture Tells a Story** is a groundbreaking app that allows anyone, with just a picture, a rough story idea, and perhaps an author's name, to craft creative stories like a seasoned author. Users can publish their stories or keep them private on their shelf. They can browse through a vast library of stories in various genres, read them, or immerse themselves by listening, and can even chat with the main characters of the stories. Stories can be liked or saved for reading them later.

## 𝌞Contents

1. [Tech Stack](https://github.com/hy-atharv/Pictorica/blob/main/README.md#%EF%B8%8Ftech-stack-used-in-pictorica)
2. [Demonstration](https://github.com/hy-atharv/Pictorica/blob/main/README.md#%EF%B8%8Fdemonstration)
3. [Installation](https://github.com/hy-atharv/Pictorica/blob/main/README.md#%EF%B8%8Ftry-it-yourself)
4. [Documentation](https://github.com/hy-atharv/Pictorica/blob/main/README.md#documentation)

## ⚙️Tech Stack Used in Pictorica

- [React Native](https://reactnative.dev)
- [Expo SDK](https://docs.expo.dev/versions/latest/)
- [Expo Application Services](https://expo.dev/eas)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Cloud Storage](https://firebase.google.com/docs/storage)

And lastly, [**The Gemini API**](https://ai.google.dev/gemini-api) that acts as the **AI Powerhouse of Pictorica**!

You can find this App's dependencies, sub-dependencies, installation paths and their compatible versions in the [package-lock.json](https://github.com/hy-atharv/Pictorica/blob/main/package-lock.json)


## ▶️Demonstration
**Watch the Video to see the App in action!**

<p align="center">
  <a href="https://youtu.be/BlGpkClaqrA?feature=shared">
    <img src="https://github.com/user-attachments/assets/debf329b-e421-4164-a29b-0ed536ccd70d" alt="Pictorica_SplashScreen" width="640" height="360">
  </a>
</p>


## ⬇️Try it yourself
**Since actions speak more than words, I recommend you to download the App on your phone to understand its features even better.
Here's a Google Drive Folder link for the Pictorica Version 1.0.0 APK File for Android. For IOS, I am currently unable to distribute it in the App Store.**

<p align="center">
<a href="https://drive.google.com/drive/folders/1rqd9TlPkKXGptSOiWt1CGFisUjdFCSrh?usp=sharing">
<b>Download Pictorica APK 1.0.0</b>
</p>

# 📜Documentation

1. [Structure of App Codebase](https://github.com/hy-atharv/Pictorica/tree/main?tab=readme-ov-file#structure-of-app-codebase)
2. [Firebase Authentication]()
3. [Cloud Firestore Schema]()
4. [Cloud Storage Schema]()
5. [General Features]()
6. [Gemini API Features]()
7. [Feature Requiring Contributions]()


## Structure of App Codebase


<p align="center">
    <img src="https://github.com/user-attachments/assets/602c5d95-e23b-4214-a36e-7e0c243f23d2"  width="640" height="580">
</p>


## Firebase Authentication

In the [**Firebase**](https://github.com/hy-atharv/Pictorica/tree/main/Firebase) Folder,
You can find 3 files:

1. [**firebaseConfig.js**](https://github.com/hy-atharv/Pictorica/blob/main/Firebase/firebaseConfig.js)

`firebaseConfig` initializes your Firebase App and its instance is stored in `app` which is exported for use in other code files.

With `app` Firestore is initialized with a Firestore setting:

`experimentalAutoDetectLongPolling:true`

This setting configures the SDK's underlying transport (WebChannel) to automatically detect if long-polling should be used. This is very similar to `experimentalForceLongPolling`, but only uses long-polling if required.

Firestore's instance is stored in `db` which is exported for use in other code files.

Authentication is initialized by `app` with the `persistence` property as:

`persistence: getReactNativePersistence(AsyncStorage)`

With the `AsyncStorage` and `getReactNativePersistence`, app's authentication state is persisted.

2. [**firebaseRegister.js**](https://github.com/hy-atharv/Pictorica/blob/main/Firebase/firebaseRegister.js)

With the Firestore instance `db` the asynchronous function `createUser(email, password, username)` creates a user with email and password and updates the user's profile by setting the `displayName` property's value to `username`

`await sendEmailVerification(user)` sends an email to the user, when user verifies his email by clicking on the link received in mail, in firestore, a document is created in the collection **users** with the id as `user.uid` and initializes a Map:

`{
  username: username,
  followers:0,
  aboutMe:'',
  pfpURL:'',
}`

Any other sign up error is caught in the `catch` block and prompts the user.









