import Modal from '@mui/material/Modal'
import { TextField, Button, Typography, Checkbox, Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import dayjs from 'dayjs'
import { useState, useEffect, forwardRef } from 'react'
import { useFormik } from 'formik'
import {
    resetPasswordValidationSchema,
    todoValidationSchema,
} from '../library/form'
import { updateTodo } from '../database'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../library/firebaseConfig'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
}

export default function EditModal({
    open,
    handleClose,
    id,
    task,
    dueDate,
    FIREBASE_PATH,
}) {
    const [isChecked, setIsChecked] = useState(dueDate ? true : false)

    const formik = useFormik({
        initialValues: {
            task: task,
            dueDate: (dueDate && dueDate.toDate()) || new Date(),
        },
        validationSchema: todoValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const { task } = values
            let { dueDate } = values
            if (!isChecked) {
                dueDate = null
            }
            await updateTodo(id, { task, dueDate }, FIREBASE_PATH)
        },
    })

    const handleCheck = (event) => {
        setIsChecked(event.target.checked)
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form
                        onSubmit={formik.handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <TextField
                            id="task"
                            name="task"
                            label="Task"
                            variant="outlined"
                            style={{ margin: '0px 5px' }}
                            size="small"
                            value={formik.values.task}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.task &&
                                Boolean(formik.errors.task)
                            }
                            helperText={
                                formik.touched.task && formik.errors.task
                            }
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
                            <Box>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <MobileDateTimePicker
                                        id="reminder"
                                        name="reminder"
                                        label="Reminder"
                                        value={formik.values.dueDate}
                                        onChange={(newValue) => {
                                            formik.setFieldValue(
                                                'dueDate',
                                                newValue.$d
                                            )
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        minDate={dayjs(new Date().toString())}
                                    />
                                </LocalizationProvider>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Update Todo
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    )
}

export function ResetPasswordModal({ open, handleClose }) {
    const [isSuccess, setIsSuccess] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const handleOpenSnackbar = () => setOpenSnackbar(true)

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenSnackbar(false)
    }

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: resetPasswordValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            const { email } = values
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // Password reset email sent!
                    // ..
                    setIsSuccess(true)
                    handleOpenSnackbar()
                    resetForm({ values: '' })
                })
                .catch((error) => {
                    const errorCode = error.code
                    const errorMessage = error.message
                    // ..
                    setIsSuccess(false)
                    handleOpenSnackbar()
                })
        },
    })

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form
                        onSubmit={formik.handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            style={{ margin: '0px 5px' }}
                            size="small"
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
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Request Reset Password
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
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
        </div>
    )
}
