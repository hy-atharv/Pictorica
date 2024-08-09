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

1. [Structure of App Codebase](https://github.com/hy-atharv/Pictorica/tree/main#structure-of-app-codebase)
2. [Firebase Authentication](https://github.com/hy-atharv/Pictorica/tree/main#firebase-authentication)
3. [Cloud Firestore Schema](https://github.com/hy-atharv/Pictorica/tree/main#cloud-firestore-schema)
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

The asynchronous function `createUser(email, password, username)` creates a user with email and password and updates the user's profile by setting the `displayName` property's value to `username`

`await sendEmailVerification(user)` sends an email to the user, when user verifies his email by clicking on the link received in mail, in firestore, a document is created in the collection **users** with the id as `user.uid` and initializes a Map:

`{
  username: username,
  followers:0,
  aboutMe:'',
  pfpURL:'',
}`

Any other sign up error is caught in the `catch` block and prompts the user.

3. [**firebaseLogin.js**](https://github.com/hy-atharv/Pictorica/blob/main/Firebase/firebaseLogin.js)


The asynchronous function `signIn(email, password)` signs in an existing user to the app with the email and password.

Any other sign in error is caught in the `catch` block and prompts the user.


## Cloud Firestore Schema

<p align="center">
    <img src="https://github.com/user-attachments/assets/4cd1c057-5629-42f3-a42f-e482d9c3fc0a"  width="640" height="420">
</p>

<p align="center">
    <img src="https://github.com/user-attachments/assets/6297a12f-9464-4757-a97a-5217f40c9f68"  width="640" height="420">
</p>

Firestore can also be utilised for storing low dimensional **Vector Embeddings**.

For the case of Pictorica, the Gemini API's `text-embedding-004` model gives a 768 Dimensional Array of Vector Embeddings which can be efficiently stored for each story document as an Array.

We'll discuss more about the **Story Embeddings** in the **Gemini API Features** Section.


<p align="center">
    <img src="https://github.com/user-attachments/assets/5b1351bb-0a89-45a6-97f3-0a439f20fd98"  width="640" height="420">
</p>

A new collection with the id `username` is created for each user when a user crafts his first story or when he saves a story from the library for the first time.

The crafted stories are stored in the document **your works** and the saved stories are stored in the document **saved**.

These stories appear in the Shelf of each user, categorized as **Read Later** and **Your Works**.


## Cloud Storage Schema

<p align="center">
    <img src="https://github.com/user-attachments/assets/48b14936-1560-4034-b5e7-9644004783c2"  width="640" height="570">
</p>














