const NegativeModal = ({title, text, cancelText, confirmText, cancel, confirm}) => {
    return (
        <>
            <h2>{title}</h2>
            <p>{text}</p>
            <div className="action">
                <button onClick={cancel}>{cancelText}</button>
                <button onClick={confirm}>{confirmText}</button>
            </div>

            <style jsx>{`
              p {
                font-size: 14px;
                margin: 15px 0 45px 0;
              }

              .action {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
              }

              .action button {
                width: 155px;
                height: 35px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                font-weight: 600;
                border-radius: 5px;
              }

              .action button:first-child {
                background-color: #F2F2F2;
                color: #BFBFBF;
              }

              .action button:last-child {
                background-color: #FF4040;
                color: #fff;
              }
            `}</style>
        </>
    );
};

export default NegativeModal;