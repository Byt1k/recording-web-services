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

config.autoAddCss = false

const App = ({Component, pageProps}) => {

    const [isFetching, setIsFetching] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            try {
                const authUserData = await Api().auth.getMe()
                dispatch(setAuthUserData(authUserData))

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

    return <Component {...pageProps} />
}

// App.getInitialProps = wrapper.getInitialAppProps((store) =>
//     async ({ctx, Component}) => {
//         try {
//             const authUserData = await Api(ctx).auth.getMe()
//             store.dispatch(setAuthUserData(authUserData))
//         } catch (e) {
//             if (ctx.asPath !== '/login') {
//                 ctx.res?.writeHead(302, {
//                     Location: '/login'
//                 })
//                 ctx.res.end()
//             }
//             console.log(e)
//         }
//         return {
//             pageProps: Component.getInitialProps ? await Component.getInitialProps({...ctx, store}) : {}
//         }
//     }
// )

export default wrapper.withRedux(App)

