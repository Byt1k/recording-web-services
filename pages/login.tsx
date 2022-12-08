import Header from "../components/Header";
import {setCookie} from "nookies";
import styles from '../styles/login.module.scss'
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoginFormSchema} from "../utils/schemas/loginValidate";
import {Api} from "../api";
import {useRouter} from "next/router";


const Login = () => {

    const [passwordIsVisible, setPasswordIsVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const {register, handleSubmit, formState, reset} = useForm({
        resolver: yupResolver(LoginFormSchema),
        mode: 'onChange'
    });

    const router = useRouter()

    const [token, setToken] = useState("")

    useEffect(() => {
        if (token) {
            router.push("/")
        }
    }, [token])

    useEffect(() => reset(), [formState.isSubmitSuccessful])

    const onSubmit = async ({login, password}) => {
        try {
            const token = await Api().auth.login(login, password)
            setCookie(null, 'rwsAuthToken', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/'
            } )
            setErrorMessage('');
            setToken(token)

        } catch (e) {
            console.warn('Register err: ', e)
            if (e.response?.data.message) {
                setErrorMessage(e.response.data.message)
            }
        }
    }

    return (
        <>
            <Header />
            <div className={styles.login}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
                    <h1>Добро пожаловать!</h1>
                    <p className={styles.login__form__text}>Введите данные для входа.</p>
                    <div className={styles.login__form__field}>
                        <p>Имя пользователя</p>
                        <input {...register("login")}
                               type="text"
                               placeholder="Введите имя"/>
                    </div>
                    <div className={styles.login__form__field}>
                        <p>Пароль</p>
                        <div className={styles.login__form__field__password}>
                            <input
                                {...register("password")}
                                type={!passwordIsVisible ? "password" : "text"}
                                placeholder="Введите пароль"/>
                            <FontAwesomeIcon
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onClick={() => setPasswordIsVisible(v => !v)}
                                color="#B9BBBE" cursor="pointer" className={styles.login__form__field__password__icon}/>
                        </div>
                        <div className={styles.login__form__field__reestablishPassword}>Восстановить пароль</div>
                    </div>
                    {/*`<label className={styles.login__form__rememberMe}>*/}
                    {/*    <input type="checkbox" {...register("rememberMe")}/>*/}
                    {/*    Запомнить пароль*/}
                    {/*</label>`*/}
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button type="submit" disabled={!formState.isValid || formState.isSubmitting}>Войти</button>
                </form>
            </div>
        </>
    );
};

export default Login;


