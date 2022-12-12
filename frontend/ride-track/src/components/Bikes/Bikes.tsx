import { useEffect, useState } from "react";
import { IStorageService } from "../../services/IStorageService";
import { BikeListItem } from "./BikeListItem";
import "./Bikes.css";

interface BikesProps {
    visible: boolean;
    storageService: IStorageService;
    onClose: Function;
}

const Bikes = ({visible, storageService, onClose}: BikesProps) => {
    const [bikes, setBikes] = useState<BikeListItem[]>([]);

    useEffect(() => {
        const getBikes = async () => {
            const response = await storageService.getBikes();
            const bikeList = response.bikes.map((bike, index) => {
                const item: BikeListItem = {
                    bike: bike,
                    isEditing: false,
                    index: index
                }
                return item;
            })
            setBikes(bikeList);
        }

        getBikes();
    }, [storageService]);

    const handleClose = (event: any) => {
        event.preventDefault();
        onClose();
    }

    const handleEditBike = (bike: BikeListItem) => {
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].isEditing = true;
        setBikes(bikeList);
    }

    const bikeNameInputHandler = (event: any, bike: BikeListItem) => {
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].bike.name = event.target.value;
        setBikes(bikeList);
    }

    const weightInputHandler = (event: any, bike: BikeListItem) => {
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].bike.weight = parseFloat(event.target.value);
        setBikes(bikeList);
    }

    const handleSaveBike = (bike: BikeListItem) => {
        // Make PUT request
        
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].isEditing = false;
        setBikes(bikeList);
    }

    if (!visible) {
        return null;
    }

    return (
        <div className="bikes-container">
            <div className="list-container">
                <div className="label-container">
                    <p className="text label">Name</p>
                    <p className="text label">Weight (kg)</p>
                </div>
                <div className="bike-list">
                    {bikes.map(b => {
                        if (b.isEditing) {
                            return (
                                <div className="bike">
                                    <div className="bike-data">
                                        <input 
                                            className="bike-input" 
                                            value={b.bike.name} 
                                            onChange={(event) => bikeNameInputHandler(event, b)}/>
                                        <input 
                                            type="number" 
                                            className="bike-input weight-input" 
                                            value={b.bike.weight} 
                                            onChange={(event) => weightInputHandler(event, b)}/>
                                    </div>
                                    <button className="delete">Delete</button>
                                    <button onClick={() => handleSaveBike(b)}>Save</button>
                                </div>
                            )
                        }
                        return (
                            <div className="bike">
                                <div className="bike-data">
                                    <p className="text name">
                                        {b.bike.name}
                                    </p>
                                    <p className="text">
                                        {`${b.bike.weight}kg`}
                                    </p>
                                </div>
                                <button onClick={() => handleEditBike(b)}>Edit</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button onClick={handleClose}>Close</button>
        </div>
    )
}

export default Bikes;