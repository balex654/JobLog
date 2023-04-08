import { useState } from "react";
import { GetWeightInKilos } from "../../../common/Calculations";
import { Form } from "../../../common/Form";
import { FormField } from "../../../common/FormField";
import { BikeForm } from "../../../model/bike/BikeForm";
import { Unit } from "../../../model/user/Unit";
import { HttpStorageService } from "../../../services/HttpStorageService"
import { BikeNameField, BikeWeightField } from "../Bikes";
import "./AddBike.css";

interface AddBikeProps {
    storageService: HttpStorageService,
    cancelAction: Function,
    addedBikeAction: Function,
    unit: Unit
}

const AddBike = ({storageService, cancelAction, addedBikeAction, unit}: AddBikeProps) => {
    const [nameValue, setNameValue] = useState<string>('');
    const [weightValue, setWeightValue] = useState<string>('');
    const nameFieldId = 'name';
    const weightFieldId = 'weight';
    const [form] = useState<Form>(new Form(new Map<string, FormField>([
        [nameFieldId, new BikeNameField()],
        [weightFieldId, new BikeWeightField()]
    ])));

    const handleCancel = () => {
        cancelAction(false);
    }

    const nameInputHandler = (event: any) => {
        form.formFields.get(nameFieldId)!.value = event.target.value;
        setNameValue(event.target.value);
    }

    const weightInputHandler = (event: any) => {
        form.formFields.get(weightFieldId)!.value = event.target.value;
        setWeightValue(event.target.value);
    }

    const handleAdd = async () => {
        if (form.valid) {
            const weightFloat = parseFloat(weightValue);
            const bikeForm: BikeForm = {
                name: nameValue,
                weight: GetWeightInKilos(weightFloat, unit)
            }
            const bikeResponse = (await storageService.addBike(bikeForm)).resource;
            addedBikeAction({
                bike: bikeResponse,
                isEditing: false,
                index: -1
            });
        }
        else {
            let errors: string[] = [];
            form.formFields.forEach(f => f.errors.forEach(e => errors.push(e)));
            alert(errors.toString());
        }
    }

    return (
        <div className="popup add-bike-container">
            <input
                onChange={nameInputHandler}
                className="bike-input"
                placeholder="name"/>
            <input
                onChange={weightInputHandler}
                className="bike-input"
                placeholder={`weight (${unit === Unit.Imperial ? "lbs" : "kg"})`}
                type="number"/>
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}

export default AddBike;