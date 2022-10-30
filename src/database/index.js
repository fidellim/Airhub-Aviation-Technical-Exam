import { db } from '../library/firebaseConfig'
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
} from 'firebase/firestore'

export const queryTodos = (path) => {
    return query(collection(db, path))
}

export const getTodos = (path) => {
    return getDocs(collection(db, path))
}

export const addTodo = async (data, path) => {
    return await addDoc(collection(db, path), data)
}

export const deleteTodo = (id, path) => {
    return deleteDoc(doc(db, path, id))
}

export const updateTodo = async (id, data, path) => {
    const todoRef = doc(db, path, id)
    return await updateDoc(todoRef, data)
}
