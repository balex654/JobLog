import { useCallback, useEffect, useState } from "react";
import { BikeResponse } from "../../../model/bike/BikeResponse";
import { HttpStorageService } from "../../../services/HttpStorageService";
import AddBike from "../../bikes/AddBike/AddBike";
import "./SelectBike.css";

interface SelectBikeProps {
    storageService: HttpStorageService;
    cancelAction: Function;
    selectedAction: Function;
}

const SelectBike = ({storageService, cancelAction, selectedAction}: SelectBikeProps) => {
    const [bikes, setBikes] = useState<BikeResponse[]>([]);
    const [addBikeVisible, setAddBikeVisible] = useState<boolean>(false); 
    const getBikes = useCallback(async () => {
        const response = await storageService.getBikes();
        setBikes(response.resource!.bikes);
    }, [storageService])

    useEffect(() => {
        getBikes();
    }, [storageService, getBikes]);

    const handleCancel = () => {
        cancelAction();
    }

    const handleAddBike = () => {
        setAddBikeVisible(true);
    }

    const addBikeCancel = () => {
        setAddBikeVisible(false);
    }

    const bikeAdded = () => {
        setAddBikeVisible(false);
        getBikes();
    }
    
    return (
        <div className="popup select-bike-container">
            <p className="text">Which bike did you use?</p>
            <div className="select-bike-list">
                {bikes.map(b => {
                    return (
                        <button
                            onClick={() => selectedAction(b)} 
                            className="select-bike-button">{b.name}</button>
                    )
                })}
            </div>
            <div className="select-bike-bottom-buttons">
                <button className="button-grey" onClick={handleCancel}>Cancel</button>
                <button onClick={handleAddBike}>Add Bike</button>
            </div>
            {
                addBikeVisible &&
                <AddBike
                    cancelAction={addBikeCancel}
                    storageService={storageService}
                    addedBikeAction={bikeAdded}
                />
            }
        </div>
    )
}

export default SelectBike;