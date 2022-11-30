import styles from '../../styles/modal.module.scss'

const Modal = ({active, setActive, children}) => {
    return (
        <div className={active ? `${styles.modal} ${styles.modal_active}` : styles.modal}
             onClick={() => setActive(false)}>
            <div className={styles.modal__content} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;