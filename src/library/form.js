import * as yup from 'yup'

export const todoValidationSchema = yup.object({
    task: yup.string().required('Please enter a task.'),
    isCompleted: yup.boolean(),
    dueDate: yup.date(),
})
