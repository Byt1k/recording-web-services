import styles from '../styles/modal.module.scss'
import {useCallback, useEffect} from "react";

interface PropsType {
    active: boolean,
    setActive: Function,
    title: string,
    text?: string,
    isNegative?: boolean,
    children?: any
}

const Modal: React.FC<PropsType> = ({active, setActive, title, text, isNegative, children}) => {

    const escFunc = useCallback((e) => {
        if (e.key === 'Escape') {
            setActive(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunc, false);

        return () => {
            document.removeEventListener("keydown", escFunc, false);
        };
    }, []);

    return (
        <div className={active ? `${styles.modal} ${styles.modal_active}` : styles.modal}
             onClick={() => setActive(false)}>
            <div
                className={isNegative ? styles.modal__content : `${styles.modal__content} ${styles.modal__content_blue}`}
                onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                {text && <p>{text}</p>}
                {children}
            </div>
        </div>
    );
};

export default Modal;