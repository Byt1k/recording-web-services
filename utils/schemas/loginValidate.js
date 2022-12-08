import * as yup from 'yup'


export const LoginFormSchema = yup.object().shape({
    login: yup.string().required(),
    password: yup.string().required()
})