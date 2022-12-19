import { useEffect, useState } from "react";
import { Form } from "../../common/Form";
import { FormField } from "../../common/FormField";
import { EmptyValidator, LengthValidator, NonFloatValueValidator, NonNegativeValidator } from "../../common/Validators";
import { BikeForm } from "../../model/bike/BikeForm";
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
    const [forms, setForms] = useState<Form[]>([]);

    const bikeNameFieldId = 'name';
    const bikeWeightFieldId = 'weight';

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
            createForms(bikeList);
        }

        const createForms = (bikeList: BikeListItem[]) => {
            let forms: Form[] = [];
            bikeList.forEach(b => {
                const formMap = new Map<string, FormField>();
                const bikeNameField = new BikeNameField();
                bikeNameField.value = b.bike.name;
                const bikeWeightField = new BikeWeightField();
                bikeWeightField.value = b.bike.weight.toString();
                formMap.set(bikeNameFieldId, bikeNameField);
                formMap.set(bikeWeightFieldId, bikeWeightField);
                forms.push(new Form(formMap));
            });
            setForms(forms);
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
        forms[bike.index].formFields.get(bikeNameFieldId)!.value = event.target.value;
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].bike.name = event.target.value;
        setBikes(bikeList);
    }

    const weightInputHandler = (event: any, bike: BikeListItem) => {
        forms[bike.index].formFields.get(bikeWeightFieldId)!.value = event.target.value;
        const bikeList = bikes.map(b => b);
        bikeList[bike.index].bike.weight = parseFloat(event.target.value);
        setBikes(bikeList);
    }

    const handleSaveBike = async (bike: BikeListItem) => {
        const valid = forms[bike.index].formFields.get(bikeNameFieldId)!.valid && forms[bike.index].formFields.get(bikeWeightFieldId)!.valid;
        if (valid) {
            const bikeForm: BikeForm = {
                name: bike.bike.name,
                weight: bike.bike.weight
            }
            await storageService.editBike(bike.bike.id, bikeForm);
            const bikeList = bikes.map(b => b);
            bikeList[bike.index].isEditing = false;
            setBikes(bikeList);
        }
        else {
            let errors: string[] = [];
            forms[bike.index].formFields.forEach(f => errors.push(f.errors.toString()));
            alert(errors.toString());
        }
    }

    const handleDeleteBike = async (bike: BikeListItem) => {
        await storageService.deleteBike(bike.bike.id);
        const bikeList = bikes.filter(b => b.index !== bike.index);
        bikeList.forEach((b, i) => b.index = i);
        setBikes(bikeList);
        const formList = forms.filter((f, i) => i !== bike.index);
        setForms(formList);
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
                                    <button className="delete" onClick={() => handleDeleteBike(b)}>Delete</button>
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

class BikeNameField extends FormField {
    private readonly emptyMessage: string = 'Bike name cannot be empty';
    private readonly lengthMessage: string = 'Bike name cannot be more than 200 characters';

    public validate(): void {
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        LengthValidator(this.value, 200, this.lengthMessage, this.errors);
    }
}

class BikeWeightField extends FormField {
    private readonly emptyMessage: string = 'Bike weight cannot be empty';
    private readonly nonNumberMessage: string = 'Bike weight can only be a number';
    private readonly nonNegativeMessage: string = 'Bike weight cannot be negative';

    public validate(): void {
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        NonFloatValueValidator(this.value, this.nonNumberMessage, this.errors);
        NonNegativeValidator(this.value, this.nonNegativeMessage, this.errors);
    }
}