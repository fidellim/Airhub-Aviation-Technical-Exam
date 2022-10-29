import { TextField, Button, Typography, Checkbox, Box } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { todoValidationSchema } from '../library/form'
import { addTodo, queryTodos } from '../database'
import { onSnapshot } from 'firebase/firestore'

const Home = () => {
    const [todos, setTodos] = useState([])
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        const unsubscribe = onSnapshot(queryTodos, (querySnapshot) => {
            setTodos(
                querySnapshot.docs.map((doc) => {
                    // add doc.id to have reference for each todo
                    return { ...doc.data(), id: doc.id }
                })
            )
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
            const docRef = await addTodo({ task, dueDate, isCompleted })
            console.log('Doc Success: ', docRef)
            resetForm({ values: '' })
        },
    })

    const label = { inputProps: { 'aria-label': 'controlled' } }

    const handleCheck = (event) => {
        setIsChecked(event.target.checked)
    }

    return (
        <div className="App">
            <Typography variant="h1" component="h1">
                TODO
            </Typography>
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
                    error={formik.touched.task && Boolean(formik.errors.task)}
                    helperText={formik.touched.task && formik.errors.task}
                />
                <Box sx={{ display: 'flex' }}>
                    <Checkbox
                        {...label}
                        checked={isChecked}
                        onChange={handleCheck}
                    />
                    <Typography variant="h2" component="h2">
                        {`${isChecked ? 'Remove' : 'Add'} reminder`}
                    </Typography>
                </Box>
                {isChecked && (
                    <Box>
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
                    </Box>
                )}
                <Button variant="contained" color="primary" type="submit">
                    Add Todo
                </Button>
            </form>
            {todos.map((todo) => (
                <Box key={todo.id}>
                    <div>
                        <h1>{todo.task}</h1>
                        {todo.dueDate && (
                            <p>{todo.dueDate.toDate().toString()}</p>
                        )}
                    </div>
                </Box>
            ))}
        </div>
    )
}

export default Home
