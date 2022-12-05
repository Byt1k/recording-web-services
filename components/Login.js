import Header from "./Header";
import styles from '../styles/login.module.scss'
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {useState} from "react";
import {useActions} from "../hooks/useActions";


const Login = () => {
    const [passwordIsVisible, setPasswordIsVisible] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm();

    const {setAuthUserData} = useActions()

    const onSubmit = async ({login, password}) => {
        await setAuthUserData(login, password)
    }

    return (
        <>
            <Header isAuth={false}/>
            <div className={styles.login}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
                    <h1>Добро пожаловать!</h1>
                    <p className={styles.login__form__text}>Введите данные для входа.</p>
                    <div className={styles.login__form__field}>
                        <p>Имя пользователя</p>
                        <input {...register("login")}
                               defaultValue=""
                               type="text" required={true}
                               placeholder="Введите имя"/>
                    </div>
                    <div className={styles.login__form__field}>
                        <p>Пароль</p>
                        <div className={styles.login__form__field__password}>
                            <input
                                {...register("password")}
                                defaultValue=""
                                type={!passwordIsVisible ? "password" : "text"}
                                required={true}
                                placeholder="Введите пароль"/>
                            <FontAwesomeIcon
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onClick={() => setPasswordIsVisible(v => !v)}
                                color="#B9BBBE" cursor="pointer" className={styles.login__form__field__password__icon}/>
                        </div>
                        <div className={styles.login__form__field__reestablishPassword}>Восстановить пароль</div>
                    </div>
                    <label className={styles.login__form__rememberMe}>
                        <input type="checkbox" {...register("rememberMe")}/>
                        Запомнить пароль
                    </label>
                    <button type="submit">Войти</button>
                </form>
            </div>
        </>
    );
};

export default Login;

// export const getServerSideProps = wrapper.getServerSideProps(async ({store}) => {
//     const dispatch = store.dispatch(await setAuthUserData())
// })