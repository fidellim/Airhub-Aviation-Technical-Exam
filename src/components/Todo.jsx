import { Box, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CircleIcon from '@mui/icons-material/Circle'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { updateTodo, deleteTodo } from '../database'
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

    const handleDeleteTodo = async () => {
        await deleteTodo(id)
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: '.75rem',
                    border: '1px solid blue',
                    padding: '.5rem .5rem',
                    borderRadius: '7px',
                    minWidth: '500px',
                    width: '100%',
                }}
            >
                <Checkbox
                    checked={updateIsCompleted}
                    onChange={handleCheckBox}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CircleIcon />}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
                <Box
                    sx={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        // minWidth: '500px',
                        width: '100%',
                    }}
                >
                    <Typography
                        variant="p"
                        component="p"
                        sx={{
                            textDecoration: isCompleted
                                ? 'line-through'
                                : 'none',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            wordWrap: 'break-word',
                            display: 'inline-block',
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
                                wordWrap: 'break-word',
                            }}
                        >
                            {formatDueDate}
                            {/* {dueDate.toDate().toString()} */}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <EditIcon onClick={handleOpen} sx={{ cursor: 'pointer' }} />
                    <DeleteIcon
                        onClick={handleDeleteTodo}
                        sx={{ cursor: 'pointer' }}
                    />
                </Box>
            </Box>
            <EditModal
                open={open}
                handleClose={handleClose}
                id={id}
                task={task}
                dueDate={dueDate}
            />
        </>
    )
}

export default Todo
