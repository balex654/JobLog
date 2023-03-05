import "./Alert.css";

interface AlertProps {
    message: string;
    actionLabel: string;
    actionStyle: string;
    action: () => void;
    onCancel: Function;
}

const Alert = ({message, actionLabel, actionStyle, action, onCancel}: AlertProps) => {
    const handleCancel = () => {
        onCancel();
    }
    
    return (
        <div className="alert-container">
            <div className="text">{message}</div>
            <div className="action-button-container">
                <button onClick={handleCancel} className="button-grey">Cancel</button>
                <button 
                    onClick={action}
                    className={actionStyle}>{actionLabel}</button>
            </div>
        </div>
    )
}

export default Alert;