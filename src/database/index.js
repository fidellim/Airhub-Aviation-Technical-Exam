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

export const queryTodos = query(collection(db, 'todos'))

export const getTodos = () => {
    return getDocs(collection(db, 'todos'))
}

export const addTodo = async (data) => {
    return await addDoc(collection(db, 'todos'), data)
}

export const deleteTodo = (id) => {
    return deleteDoc(doc(db, 'todos', id))
}

export const updateTodo = async (id, data) => {
    const todoRef = doc(db, 'todos', id)
    return await updateDoc(todoRef, data)
}
