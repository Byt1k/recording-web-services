import '../styles/_zeroing.scss'
import '../styles/global.scss'
import {config} from '@fortawesome/fontawesome-svg-core'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
import {wrapper} from "../redux/store";
import {setAuthUserData} from "../redux/slices/auth";
import {Api} from "../api";
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useAppDispatch} from "../redux/hooks";
import Preloader from "../components/Preloader";
import Head from "next/head";

config.autoAddCss = false

const App = ({Component, pageProps}) => {

    const [isFetching, setIsFetching] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()

    // Проверка авторизован ли пользователь
    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            try {
                const authUserData = await Api().auth.getMe()
                dispatch(setAuthUserData(authUserData))

                if (router.asPath === '/login') {
                    await router.push('/')
                }

            } catch (e) {
                await router.push('/login')
                console.log(e)
            }
            setIsFetching(false)
        }
        fetchData()
    }, [])

    if (isFetching) {
        return <Preloader/>
    }

    return (
       <>
           <Head>
               <title>RWS</title>
               <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
           </Head>
           <Component {...pageProps} />
       </>
    )
}
export default wrapper.withRedux(App)

