import { Box, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { updateTodo } from '../database'

const Todo = ({ id, task, dueDate, isCompleted }) => {
    const formatDueDate =
        dueDate &&
        dueDate
            .toDate()
            .toString()
            .substring(4, dueDate.toDate().toString().indexOf('+'))

    const [updateIsCompleted, setUpdateIsCompleted] = useState(isCompleted)

    const handleCheckBox = () => {
        setUpdateIsCompleted((prev) => {
            updateTodo(id, { isCompleted: !prev })
            return !prev
        })
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Checkbox
                checked={updateIsCompleted}
                onChange={handleCheckBox}
                icon={<CircleOutlinedIcon />}
                checkedIcon={<CircleIcon />}
                inputProps={{ 'aria-label': 'controlled' }}
            />
            <Box>
                <Typography
                    variant="p"
                    component="p"
                    sx={{
                        textDecoration: isCompleted ? 'line-through' : 'none',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                    }}
                >
                    {task}
                </Typography>
                {dueDate && (
                    <Typography
                        variant="p"
                        component="p"
                        sx={{
                            fontSize: '.85rem',
                        }}
                    >
                        {formatDueDate}
                        {/* {dueDate.toDate().toString()} */}
                    </Typography>
                )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <EditIcon />
                <DeleteIcon />
            </Box>
        </Box>
    )
}

export default Todo
