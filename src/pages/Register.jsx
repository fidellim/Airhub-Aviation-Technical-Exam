import { useFormik } from 'formik'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../library/firebaseConfig'
import { registerValidationSchema } from '../library/form'
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
import { useNavigate, Link } from 'react-router-dom'
import { ResetPasswordModal } from '../components/Modal'
import { signOut } from 'firebase/auth'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const Register = () => {
    let navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const handleOpenModal = () => setOpenModal(true)
    const handleCloseModal = () => setOpenModal(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

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
            confirmPassword: '',
        },
        validationSchema: registerValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const { email, password, confirmPassword } = values

            if (password !== confirmPassword) {
                setIsSuccess(false)
                setOpen(true)
                setErrorMessage(`Password doesn't match. Please try again.`)
                return
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user
                    setIsSuccess(true)
                    setOpen(true)
                    resetForm({ values: '' })
                    signOut(auth)
                        .then(() => {
                            // Sign-out successful.
                            setTimeout(() => {
                                navigate(`/login`)
                            }, 1500)
                        })
                        .catch((error) => {
                            // An error happened.
                        })
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    // console.log(errorCode, errorMessage);
                    setIsSuccess(false)
                    setOpen(true)
                    setErrorMessage(`Register was unsuccessful.`)
                })
        },
    })

    return (
        <Box sx={{ padding: '1rem' }}>
            <Box
                sx={{
                    background: 'white',
                    borderRadius: '7px',
                    padding: '1rem',
                    width: {
                        xs: '100%',
                        sm: '450px',
                    },
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: {
                            xs: '1.5rem',
                            sm: '2rem',
                        },
                        textAlign: 'center',
                        marginBottom: '5px',
                        color: '#000058',
                    }}
                >
                    Create an account!
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
                                formik.touched.email &&
                                Boolean(formik.errors.email)
                            }
                            helperText={
                                formik.touched.email && formik.errors.email
                            }
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
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                        <TextField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.confirmPassword &&
                                Boolean(formik.errors.confirmPassword)
                            }
                            helperText={
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                            }
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                        >
                            Register
                        </Button>
                    </Box>
                </form>
                <Box
                    sx={{
                        border: '2px solid lightBlue',
                        margin: '1rem 0',
                        borderRadius: '7px',
                        textTransform: 'uppercase',
                    }}
                >
                    <Link to="/login">
                        <Typography
                            variant="h4"
                            component="h4"
                            sx={{
                                fontSize: '14px',
                                textAlign: 'center',
                                padding: '6px 16px',
                            }}
                        >
                            Login
                        </Typography>
                    </Link>
                </Box>
            </Box>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={`${isSuccess ? 'success' : 'error'}`}
                    sx={{ width: '100%' }}
                >
                    {`${isSuccess ? 'Register Success!' : errorMessage}`}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Register
