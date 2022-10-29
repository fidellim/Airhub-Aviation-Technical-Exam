import { db, FIREBASE_COLLECTION } from '../library/firebaseConfig'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
} from 'firebase/firestore'

export const queryTodos = query(collection(db, FIREBASE_COLLECTION))

export const getTodos = () => {
    return getDocs(collection(db, FIREBASE_COLLECTION))
}

export const addTodo = async (data) => {
    return await addDoc(collection(db, FIREBASE_COLLECTION), data)
}

export const deleteTodo = (id) => {
    return deleteDoc(doc(db, FIREBASE_COLLECTION, id))
}

export const updateTodo = async (id, data) => {
    const todoRef = doc(db, FIREBASE_COLLECTION, id)
    return await updateDoc(todoRef, data)
}
