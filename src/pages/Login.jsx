import { useFormik } from 'formik'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../library/firebaseConfig'
import { loginValidationSchema } from '../library/form'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import {
    Typography,
    Box,
    FormHelperText,
    Select,
    FormControl,
    MenuItem,
    InputLabel,
    TextField,
    Button,
    IconButton,
} from '@mui/material'
import { useState, forwardRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Login = () => {
    let navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate(`/`)
            } else {
                // User is signed out
                navigate(`/login`)
            }
        })

        return () => unsubscribe()
    }, [])

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const { email, password } = values
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user
                    setIsSuccess(true)
                    setOpen(true)
                    resetForm({ values: '' })
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    // console.log(errorCode, errorMessage);
                    setOpen(true)
                })
        },
    })

    return (
        <>
            <Typography
                variant="h2"
                sx={{
                    fontSize: {
                        xs: '1.5rem',
                        sm: '2.5rem',
                    },
                    textAlign: 'center',
                    marginBottom: '5px',
                }}
            >
                Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}
                >
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        type="text"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                    >
                        Login
                    </Button>
                </Box>
            </form>
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
        </>
    )
}

export default Login
