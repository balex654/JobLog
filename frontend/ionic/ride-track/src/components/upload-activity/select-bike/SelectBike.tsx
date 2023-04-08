import { useCallback, useEffect, useState } from "react";
import { BikeResponse } from "../../../model/bike/BikeResponse";
import { HttpStorageService } from "../../../services/HttpStorageService";
import AddBike from "../../bikes/AddBike/AddBike";
import "./SelectBike.css";
import { Storage, Drivers } from "@ionic/storage";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";

interface SelectBikeProps {
    storageService: HttpStorageService;
    cancelAction: Function;
    selectedAction: Function;
}

const SelectBike = ({storageService, cancelAction, selectedAction}: SelectBikeProps) => {
    const [bikes, setBikes] = useState<BikeResponse[]>([]);
    const [addBikeVisible, setAddBikeVisible] = useState<boolean>(false);
    const [storage] = useState<Storage>(new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    }))
    storage.create();
    const [unitValue, setUnit] = useState<Unit>(Unit.Imperial);
    const getBikes = useCallback(async () => {
        const response = await storageService.getBikes();
        setBikes(response.resource!.bikes);
    }, [storageService])

    useEffect(() => {
        const init = async () => {
            const user = JSON.parse(await storage.get("user")) as UserResponse;
            setUnit(user.unit);
        }

        init();
        getBikes();
    }, [storageService, getBikes, storage]);

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
                    unit={unitValue}
                />
            }
        </div>
    )
}

export default SelectBike;