import styles from '../styles/modal.module.scss'

const Modal = ({
                   active,
                   setActive,
                   title,
                   text,
                   cancelText,
                   form,
                   confirmText,
                   cancel,
                   confirm,
                   isNegative,
                   children
               }) => {

    return (
        <div className={active ? `${styles.modal} ${styles.modal_active}` : styles.modal}
             onClick={() => setActive(false)}>
            <div className={isNegative ? styles.modal__content : `${styles.modal__content} ${styles.modal__content_blue}`}
                 onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                {text && <p>{text}</p>}
                {children && <>
                    {children}
                    <div className={styles.modal__content__action}>
                        <button onClick={cancel}>{cancelText}</button>
                        <button className={isNegative ? styles.negative : styles.positive}
                                type="submit" form={form}>
                            {confirmText}
                        </button>
                    </div>
                </>}
                {!children && <div className={styles.modal__content__action}>
                    <button onClick={cancel}>{cancelText}</button>
                    <button className={isNegative ? styles.negative : styles.positive}
                            onClick={confirm}>
                        {confirmText}
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default Modal;