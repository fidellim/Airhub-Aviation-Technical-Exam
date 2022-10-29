import { Box, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { updateTodo } from '../database'
import EditModal from './Modal'

const Todo = ({ id, task, dueDate, isCompleted }) => {
    const formatDueDate =
        dueDate &&
        dueDate
            .toDate()
            .toString()
            .substring(4, dueDate.toDate().toString().indexOf('+'))

    const [updateIsCompleted, setUpdateIsCompleted] = useState(isCompleted)
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

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
                <EditIcon onClick={handleOpen} sx={{ cursor: 'pointer' }} />
                <DeleteIcon sx={{ cursor: 'pointer' }} />
            </Box>
            <EditModal
                open={open}
                handleClose={handleClose}
                id={id}
                task={task}
                dueDate={dueDate}
            />
        </Box>
    )
}

export default Todo
