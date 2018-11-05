import * as firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: process.env.REACT_APP_DATABASE_API_KEY,
  authDomain: `${process.env.REACT_APP_DATABASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${
    process.env.REACT_APP_DATABASE_PROJECT_ID
  }.firebaseio.com`,
  projectId: process.env.REACT_APP_DATABASE_PROJECT_ID,
}

firebase.initializeApp(config)

export const database = firebase.firestore()

database.settings({
  timestampsInSnapshots: true,
})

export interface Idea {
  id?: string
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

const getIdeasOfTypeForRetro = (retroId: RetroId, type: IdeaType) =>
  database
    .collection('retros')
    .doc(retroId)
    .collection(type)
    .get()
    .then(snapshots =>
      Promise.resolve(
        snapshots.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      ),
    )

export const getHappyIdeasForRetro = (retroId: RetroId) =>
  getIdeasOfTypeForRetro(retroId, 'happy')

export const getSadIdeasForRetro = (retroId: RetroId) =>
  getIdeasOfTypeForRetro(retroId, 'sad')

export const getConfusedIdeasForRetro = (retroId: RetroId) =>
  getIdeasOfTypeForRetro(retroId, 'confused')
