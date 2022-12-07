import { IStorageService } from "../../services/IStorageService";
import "./Bikes.css";

interface BikesProps {
    visible: boolean;
    storageService: IStorageService;
    onClose: Function;
}

const Bikes = ({visible, storageService, onClose}: BikesProps) => {

    const handleClose = (event: any) => {
        event.preventDefault();
        onClose();
    }

    if (!visible) {
        return null;
    }

    return (
        <div className="bikes-container">
            <div className="list-container">
                <div className="label-container">
                    <p className="text label">Name</p>
                    <p className="text label">Weight</p>
                </div>
                <div className="bike-list">
                    <div className="bike">
                        <div className="bike-data">
                            <p className="text name">
                                Road bike
                            </p>
                            <p className="text">
                                10kg
                            </p>
                        </div>
                        <button>Edit</button>
                    </div>
                </div>
            </div>
            
            <button onClick={handleClose}>Close</button>
        </div>
    )
}

export default Bikes;