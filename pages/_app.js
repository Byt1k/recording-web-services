import '../styles/_zeroing.scss'
import '../styles/global.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
import {wrapper} from '../store'

config.autoAddCss = false

const MyApp = ({ Component, pageProps }) => {
    return <Component {...pageProps} />
}

export default wrapper.withRedux(MyApp)

