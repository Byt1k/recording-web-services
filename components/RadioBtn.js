import styles from '../styles/radioBtn.module.scss'

const RadioBtn = ({id, checked, ...props}) => {
    return (
        <>
            <input type="radio" className={styles.inputRadio} id={id} checked={checked} value={id} {...props}/>
            <label htmlFor={id}/>
        </>
    );
};

export default RadioBtn;