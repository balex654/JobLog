import { useState } from "react";
import "./SaveActivityAlert.css";

interface SaveActivityAlertProps {
    saveAction: (name: string) => void;
}

const SaveActivityAlert = ({saveAction}: SaveActivityAlertProps) => {
    const [nameValue, setNameValue] = useState<string>("");

    const nameInputHandler = (event: any) => {
        setNameValue(event.target.value);
    }

    return (
        <div className="save-activity-container">
            <div className="text">Enter Activity Name</div>
            <input
                className="name-input" 
                onChange={nameInputHandler} 
                placeholder="Activity Name"/>
            <button onClick={() => saveAction(nameValue)}>Save</button>
        </div>
    )
}

export default SaveActivityAlert;