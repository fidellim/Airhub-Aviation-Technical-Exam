import Modal from '@mui/material/Modal'
import { TextField, Button, Typography, Checkbox, Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { todoValidationSchema } from '../library/form'
import { updateTodo } from '../database'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

export default function EditModal({ open, handleClose, id, task, dueDate }) {
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
            updateTodo(id, { task, dueDate })
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
                    <form onSubmit={formik.handleSubmit}>
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
