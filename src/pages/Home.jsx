import { TextField, Button, Typography, Checkbox, Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import dayjs from 'dayjs'
import { useState, useEffect, forwardRef } from 'react'
import { useFormik } from 'formik'
import { todoValidationSchema } from '../library/form'
import { addTodo, queryTodos } from '../database'
import { onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../library/firebaseConfig'
import Todo from '../components/Todo'
import { useNavigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Home = () => {
    let navigate = useNavigate()
    const [todos, setTodos] = useState([])
    const [open, setOpen] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [user, setUser] = useState()
    const [FIREBASE_PATH, setFirebasePath] = useState()

    useEffect(() => {
        const unsubscribe =
            FIREBASE_PATH &&
            onSnapshot(queryTodos(FIREBASE_PATH), (querySnapshot) => {
                setTodos(
                    querySnapshot.docs.map((doc) => {
                        // add doc.id to have reference for each todo
                        return { ...doc.data(), id: doc.id }
                    })
                )
            })

        return () => FIREBASE_PATH && unsubscribe()
    }, [FIREBASE_PATH])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid
                setFirebasePath(`users/${uid}/todos`)
                setUser(user)
                setIsSuccess(true)
                setOpen(true)
            } else {
                // User is signed out
                navigate(`/login`)
            }
        })

        return () => unsubscribe()
    }, [])

    const formik = useFormik({
        initialValues: {
            task: '',
            isCompleted: false,
            dueDate: new Date(),
        },
        validationSchema: todoValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const { task, isCompleted } = values
            let { dueDate } = values
            if (!isChecked) {
                dueDate = null
            }
            const docRef = await addTodo(
                { task, dueDate, isCompleted },
                FIREBASE_PATH
            )
            resetForm({ values: '' })
        },
    })

    const handleCheck = (event) => {
        setIsChecked(event.target.checked)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            })
    }

    return (
        <Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '1rem 1rem 1rem 1rem',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <Button variant="outlined" onClick={handleSignOut}>
                        Logout
                    </Button>
                    <Typography
                        variant="h6"
                        component="h6"
                        sx={{ fontSize: '1rem' }}
                    >
                        {user && user.email}
                    </Typography>
                </Box>
            </Box>

            <Typography
                variant="h1"
                component="h1"
                sx={{
                    fontSize: { xs: '2rem', sm: '3rem', md: '96px' },
                    padding: '0 1.5rem',
                    textAlign: 'center',
                    margin: {
                        xs: '4.5rem 0 0 0',
                        sm: '3rem 0 0 0',
                    },
                }}
            >
                TODO
            </Typography>
            <form
                onSubmit={formik.handleSubmit}
                style={{ padding: '0 1.5rem' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.5rem',
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '7px',
                        marginBottom: '.5rem',
                    }}
                >
                    <TextField
                        id="task"
                        name="task"
                        label="Task"
                        variant="outlined"
                        fullWidth
                        value={formik.values.task}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.task && Boolean(formik.errors.task)
                        }
                        helperText={formik.touched.task && formik.errors.task}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                            checked={isChecked}
                            onChange={handleCheck}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography variant="p" component="p">
                            {`${isChecked ? 'Remove' : 'Add'} reminder`}
                        </Typography>
                    </Box>
                    {isChecked && (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker
                                id="reminder"
                                name="reminder"
                                label="Reminder"
                                value={formik.values.dueDate}
                                onChange={(newValue) => {
                                    formik.setFieldValue('dueDate', newValue.$d)
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                minDate={dayjs(new Date().toString())}
                            />
                        </LocalizationProvider>
                    )}
                </Box>
                <Button variant="contained" color="primary" type="submit">
                    Add Todo
                </Button>
            </form>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.5rem',
                    marginTop: '2rem',
                    padding: '0 1.5rem',
                }}
            >
                {todos
                    .sort((a, b) => a.isCompleted - b.isCompleted)
                    .map((todo) => (
                        <Todo
                            key={todo.id}
                            {...todo}
                            FIREBASE_PATH={FIREBASE_PATH}
                        />
                    ))}
            </Box>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={`${isSuccess ? 'success' : 'error'}`}
                    sx={{ width: '100%' }}
                >
                    {`${
                        isSuccess
                            ? 'Login Success!'
                            : 'Email/password is incorrect. Please try again.'
                    }`}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Home
