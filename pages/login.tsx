import Header from "../components/Header";
import {destroyCookie, setCookie} from "nookies";
import styles from '../styles/login.module.scss'
import {useForm} from "react-hook-form";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from "@fortawesome/free-regular-svg-icons";
import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoginFormSchema} from "../utils/schemas/loginValidate";
import {Api} from "../api";
import {useRouter} from "next/router";
import {setAuthUserData} from "../redux/slices/auth";
import {useAppDispatch} from "../redux/hooks";
import Preloader from "../components/Preloader";


const Login = () => {
    const [isFetching, setIsFetching] = useState(false)

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
            setIsFetching(true)
            router.push("/")
        }
    }, [token])

    useEffect(() => reset(), [formState.isSubmitSuccessful])

    const dispatch = useAppDispatch()

    const onSubmit = async ({login, password}) => {
        setIsFetching(true)
        try {
            const token = await Api().auth.login(login, password)
            setCookie(null, 'rwsAuthToken', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/'
            } )
            const authUserData = await Api().auth.getMe()

            if (authUserData.Capabilities[0].CanRead === 'true') {
                dispatch(setAuthUserData(authUserData))
                setErrorMessage('');
                setToken(token)
                setIsFetching(false)
            } else if (authUserData.Capabilities[0].CanRead === 'false') {
                setErrorMessage('?? ?????????????? ???????????? ?????? ??????????????. ???????????????????????? ?? ????????????????????????????')
                destroyCookie(null, "rwsAuthToken")
            }

        } catch (e) {
            console.warn('Register err: ', e)
            if (e.response?.data.message) {
                setErrorMessage(e.response.data.message)
            }
        }
        setIsFetching(false)
    }

    if (isFetching) {
        return <Preloader/>
    }

    return (
        <>
            <Header />
            <div className={styles.login}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
                    <h1>?????????? ????????????????????!</h1>
                    <p className={styles.login__form__text}>?????????????? ???????????? ?????? ??????????.</p>
                    <div className={styles.login__form__field}>
                        <p>?????? ????????????????????????</p>
                        <input {...register("login")}
                               type="text"
                               placeholder="?????????????? ??????"/>
                    </div>
                    <div className={styles.login__form__field}>
                        <p>????????????</p>
                        <div className={styles.login__form__field__password}>
                            <input
                                {...register("password")}
                                type={!passwordIsVisible ? "password" : "text"}
                                placeholder="?????????????? ????????????"/>
                            <FontAwesomeIcon
                                icon={passwordIsVisible ? faEye : faEyeSlash}
                                onMouseDown={() => setPasswordIsVisible(true)}
                                onMouseUp={() => setPasswordIsVisible(false)}
                                color="#B9BBBE" cursor="pointer" className={styles.login__form__field__password__icon}/>
                        </div>
                        <div className={styles.login__form__field__reestablishPassword}>???????????????????????? ????????????</div>
                    </div>
                    {/*`<label className={styles.login__form__rememberMe}>*/}
                    {/*    <input type="checkbox" {...register("rememberMe")}/>*/}
                    {/*    ?????????????????? ????????????*/}
                    {/*</label>`*/}
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button type="submit" disabled={!formState.isValid || formState.isSubmitting}>??????????</button>
                </form>
            </div>
        </>
    );
};

export default Login;


