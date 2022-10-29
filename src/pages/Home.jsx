import { TextField, Button } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'
import React, { useState } from 'react'

const Home = () => {
    const [todos, setTodos] = useState([])
    const [input, setInput] = useState('')
    const [value, setValue] = useState(new Date())
    const [isChecked, setIsChecked] = useState(false)
    const addTodo = (e) => {
        e.preventDefault()
        setTodos([
            ...todos,
            { todo: input, dueDate: value ? value.toString() : null },
        ])
        setInput('')
        setValue(new Date())
    }

    const label = { inputProps: { 'aria-label': 'controlled' } }

    const handleCheck = (event) => {
        setIsChecked(event.target.checked)
    }

    return (
        <div className="App">
            <h1>TODO</h1>
            <form>
                <TextField
                    id="outlined-basic"
                    label="Make Todo"
                    variant="outlined"
                    style={{ margin: '0px 5px' }}
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Box sx={{ display: 'flex' }}>
                    <Checkbox
                        {...label}
                        checked={isChecked}
                        onChange={handleCheck}
                    />
                    <h2>{`${isChecked ? 'Remove' : 'Add'} reminder`}</h2>
                </Box>
                {isChecked && (
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDateTimePicker
                                label="Reminder"
                                value={value}
                                onChange={(newValue) => {
                                    console.log(newValue.$d)
                                    setValue(newValue)
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                minDate={dayjs(new Date().toString())}
                            />
                        </LocalizationProvider>
                    </Box>
                )}
                <Button variant="contained" color="primary" onClick={addTodo}>
                    Add Todo
                </Button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.todo}>
                        <div>
                            <h1>{todo.todo}</h1>
                            <p>{todo.dueDate.split('+')[0]}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home
