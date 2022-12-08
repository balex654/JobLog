import { useEffect, useState } from "react";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { IStorageService } from "../../services/IStorageService";
import "./Bikes.css";

interface BikesProps {
    visible: boolean;
    storageService: IStorageService;
    onClose: Function;
}

const Bikes = ({visible, storageService, onClose}: BikesProps) => {
    const [bikes, setBikes] = useState<BikeResponse[]>([]);

    useEffect(() => {
        const getBikes = async () => {
            const response = await storageService.getBikes();
            setBikes(response.bikes);
        }

        getBikes();
    }, [storageService]);

    const handleClose = (event: any) => {
        event.preventDefault();
        onClose();
    }

    const handleEditBike = (bike: BikeResponse) => {
        console.log(bike)
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
                    {bikes.map(b => 
                        <div className="bike">
                            <div className="bike-data">
                                <p className="text name">
                                    {b.name}
                                </p>
                                <p className="text">
                                    {`${b.weight}kg`}
                                </p>
                            </div>
                            <button onClick={() => handleEditBike(b)}>Edit</button>
                        </div>
                    )}
                </div>
            </div>
            
            <button onClick={handleClose}>Close</button>
        </div>
    )
}

export default Bikes;