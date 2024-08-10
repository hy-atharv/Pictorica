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

1. [Structure of App Codebase](https://github.com/hy-atharv/Pictorica/blob/main/README.md#structure-of-app-codebase)
2. [Firebase Authentication](https://github.com/hy-atharv/Pictorica/blob/main/README.md#firebase-authentication)
3. [Cloud Firestore Schema](https://github.com/hy-atharv/Pictorica/blob/main/README.md#cloud-firestore-schema)
4. [Cloud Storage Schema](https://github.com/hy-atharv/Pictorica/blob/main/README.md#cloud-storage-schema)
5. [General Features](https://github.com/hy-atharv/Pictorica/blob/main/README.md#general-features)
6. [Gemini API Features](https://github.com/hy-atharv/Pictorica/blob/main/README.md#gemini-api-features)



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


## General Features

Other than **creating, reading and listening to Stories**, Pictorica also offers most of the common features that any other social media app would offer.


1. **Profile Page with Analytics**

<p align="center">
  <img src="https://github.com/user-attachments/assets/d2f028d7-fb97-4d8e-b785-d0faeda4f1c8"  width="236" height="419">
</p>



2. **Feed/Library**

<p align="center">
  <img src="https://github.com/user-attachments/assets/f706f0cb-3f25-465e-99ca-67e5b1a27ea5"  width="236" height="419">
</p>




3. **Double Tap to Like**

<p align="center">
  <img src="https://github.com/user-attachments/assets/aa8a9695-315b-4aec-b79a-2b6760b5e54b"  width="236" height="419">
</p>


4. **Save to Read Later**

<p align="center">
  <img src="https://github.com/user-attachments/assets/dc6adac6-bb9e-43ef-9be2-2e09cabbad06"  width="236" height="419">
  <img src="https://github.com/user-attachments/assets/bcb1c774-eb6f-4025-a982-6346c0bc0dea"  width="236" height="419">
</p>



5. **Search your feed/library**

<p align="center">
  <img src="https://github.com/user-attachments/assets/15dd7640-d030-4680-96c4-e006a6144de4"  width="236" height="419">
</p>



6. **Upload privately/Keep in Shelf** or **Upload publicly/Publish in Library**

<p align="center">
  <img src="https://github.com/user-attachments/assets/275fa9d2-09e2-4e4c-9496-7f14050ce9be"  width="236" height="419">
  
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/5b9adc9b-431e-4d6c-9bfc-b70f93db8164"  width="236" height="419">
  <img src="https://github.com/user-attachments/assets/4e33bc13-32c0-43ea-8b83-90b83ab6f726"  width="236" height="419">
</p>




7. **Your Published Works Analytics and Performance**

<p align="center">
  <img src="https://github.com/user-attachments/assets/e949e64e-55f8-44ac-adc2-f4d286d4e914"  width="236" height="419">
</p>



8. **Share this App**

<p align="center">
  <img src="https://github.com/user-attachments/assets/5792f155-bcd8-4cea-97d7-f9b89e995f22"  width="236" height="419">
</p>


9. **Send Feedback**

<p align="center">
  <img src="https://github.com/user-attachments/assets/c0ef7337-b882-4d9b-a2a2-15d2869454a5"  width="236" height="419">
</p>




## Gemini API Features

**All the requests are sent to the Gemini API via a REST API using [Axios](https://axios-http.com/docs/intro)**


1. **Story Ideas Generation based on Picture and Genre**

<p align="center">
  <img src="https://github.com/user-attachments/assets/24c1b839-b330-4811-8d32-4c14e80f7bf8"  width="236" height="419">
</p>


Before even creating your story with your rough idea, Gemini will recommend you with some **creative story ideas** based on the **Picture** you uploaded and the **Genre** you selected.

This gives you a good start while creating your next Bestseller!

For Reference, you can have a look at the [GemImageDesc.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemImageDesc.js)


2. **Craft your stories with your Main Character, a Rough Idea and a Title, in your favourite Author Style**

<p align="center">
  <img src="https://github.com/user-attachments/assets/e719a0e9-cd98-4509-920c-905772eaa6ea"  width="236" height="419">
  <img src="https://github.com/user-attachments/assets/2876d3fd-b67e-4704-85ea-0f5ade24f933"  width="236" height="419">
</p>

Create your stories on the genre you selected, picture you uploaded and just some few parameters such as:

- Your fav **Author Name** to help Gemini write your story in the style you love.
- Your **Main Character** that you would want to see as your Hero/Villain.
- Your **rough Story Idea/Description** or even a detailed one.
- A **Creative Title** that attracts the readers.

While your story idea is a must, **the author name, main character and the title can be even generated by Gemini** which will suit your Picture, Genre and Idea.

When the Gemini generates the story, it also provides the Reading Time for that story length, which will be helpful for the users to allocate their time and choose short or long stories.

This is possible because of Gemini API's [**Multi Modal Input**](https://ai.google.dev/gemini-api/docs/text-generation?lang=python#generate-text-from-text-and-image)

For Reference, you can have a look at the [GemStoryGen.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemStoryGen.js)



3. **Step Inside the Story and Talk with the Main Character**

<p align="center">
  <img src="https://github.com/user-attachments/assets/c6b9df95-27b0-41c0-8132-e4638b1438dd"  width="236" height="419">
</p>

Ever wondered why a particular event happened in the story? or just curious to know more about the story and its characters?

With Pictorica, you can step inside the Story and talk with the Main Character himself.

This is possible because of the Gemini API's [**System Instructions**](https://ai.google.dev/gemini-api/docs/system-instructions?lang=rest) and [**Interactive Chat/Multi Turn Conversations**](https://ai.google.dev/gemini-api/docs/text-generation?lang=python#chat)

For Reference, you can have a look at the [GemCharChat.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemCharChat.js)


4. **Embeddings Generation and Semantic Retrieval**

<p align="center">
  <img src="https://github.com/user-attachments/assets/d69640b5-b482-48b4-8c6d-638e5d8421e2"  width="236" height="419">
  <img src="https://github.com/user-attachments/assets/c39ee523-4d3d-4364-b424-3b6877235c39"  width="236" height="419">
</p>



This is my personal favourite feature and I believe all social media apps should have a **Context Based Search/Semantic Retrieval** rather than a normal Keyword Search. Generally, we might encounter content that we found interesting but **we forgot its Title, its Characters and are left with no records except its memories of what actually happens in it or just a rough idea of the events that occured in it**. In that case, **Semantic Search** acts as a **lifesaver** and helps us find the content just with whatever we **remember about it**.

The Gemini API offers two models that generate text embeddings: Text Embeddings and Embeddings. Text Embeddings is an updated version of the Embedding model that offers elastic embedding sizes under 768 dimensions.

For Pictorica, the `text-embedding-004` model gives a 768 Dimensional Array of Vector Embeddings that are stored as an Array in the Firestore for each Story.

For Reference, you can have a look at the [GemStoryEmbeds.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemStoryEmbeds.js)



Text embeddings are a natural language processing (NLP) technique that converts text into numerical coordinates (called vectors) that can be plotted in an n-dimensional space. This approach lets you treat pieces of text as bits of relational data, which we can then train models on.

Embeddings capture semantic meaning and context which results in text with similar meanings having closer embeddings. For example, the sentence "I took my dog to the vet" and "I took my cat to the vet" would have embeddings that are close to each other in the vector space since they both describe a similar context.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d69fec16-b0c7-4e13-888b-956cf52f81ec"  width="540" height="360">
</p>


You can use embeddings to compare different texts and understand how they relate. For example, if the embeddings of the text "cat" and "dog" in 2-Dimensional space are close together with that of "kitten" and "puppy" you can infer that these words are similar in meaning or context or both. While the embeddings of "helicopter" are relatively far away from them as it should be.


The 768-Dimensional Vector Embeddings of the Stories in the Firestore are compared against the same Dimensional Vector Embeddings of the Search Query ([GemSearchEmbeds.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemSearchEmbeds.js)) using the **Cosine Similarity Measure**, that returns a value between `-1` and `1`.

`-1` represents that the 2 Vectors are in opposite direction. `1` represents that the 2 Vectors are in same direction.

The similarity scores are sorted and the Top 5 stories with most similarity are retrieved from the Firestore and are shown to the user as Relevant Results.

For Reference you can have a look at the [SearchStory.js](https://github.com/hy-atharv/Pictorica/blob/main/components/TabScreens/Routes/LibraryRoute/SearchStory.js)



5. **Your Works Impressions and Likes, and Performance analysed by the Gemini**

<p align="center">
  <img src="https://github.com/user-attachments/assets/a1622df8-a380-4cef-997f-8eb5f001bd2b"  width="236" height="419">
</p>

Gemini with large context window can analyze all the content in the Library and their analytics for you, and helps you with the Insights on your content compared to the best performing content and enables you to improvise on your content to rank better in the Library.

For Reference, you can have a look at the [GemInsights.js](https://github.com/hy-atharv/Pictorica/blob/main/GeminiAI/GemInsights.js)















