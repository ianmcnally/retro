import * as firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_DATABASE_API_KEY,
  authDomain: `${process.env.REACT_APP_DATABASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.REACT_APP_DATABASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.REACT_APP_DATABASE_PROJECT_ID,
}

firebase.initializeApp(config)

export const database = firebase.firestore()

database.settings({
  timestampsInSnapshots: true,
})

interface Idea {
  content: string
  starred: boolean
  votes: number
}

type IdeaType = 'happy' | 'sad' | 'confused'

type RetroId = string

const addIdeaOfTypeToRetro = (idea: Idea, type: IdeaType, retroId: RetroId) =>
  database
    .collection('retros')
    .doc(retroId)
    .collection(type)
    .add(idea)

export const addHappyIdeaToRetro = (idea: Idea, retroId: RetroId) =>
  addIdeaOfTypeToRetro(idea, 'happy', retroId)

export const addSadIdeaToRetro = (idea: Idea, retroId: RetroId) =>
  addIdeaOfTypeToRetro(idea, 'sad', retroId)

export const addConfusedIdeaToRetro = (idea: Idea, retroId: RetroId) =>
  addIdeaOfTypeToRetro(idea, 'confused', retroId)

export const getHappyIdeasForRetro = (retroId: RetroId) =>
  database
    .collection('retros')
    .doc(retroId)
    .collection('happy')
    .get()

export const getSadIdeasForRetro = (retroId: RetroId) =>
  database
    .collection('retros')
    .doc(retroId)
    .collection('sad')
    .get()

export const getConfusedIdeasForRetro = (retroId: RetroId) =>
  database
    .collection('retros')
    .doc(retroId)
    .collection('confused')
    .get()
