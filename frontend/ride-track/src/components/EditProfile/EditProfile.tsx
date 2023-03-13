import { useEffect, useState } from "react";
import { IStorageService } from "../../services/IStorageService";
import { UserResponse } from "../../model/user/UserResponse";
import "./EditProfile.css";
import { Form } from "../../common/Form";
import { FormField } from "../../common/FormField";
import { FirstNameField, LastNameField, WeightField } from "../ConfigureAccount/ConfigureAccount";
import { UserForm } from "../../model/user/UserForm";
import { Unit } from "../../model/user/Unit";

interface EditProfileProps {
    storageService: IStorageService;
    onClose: Function;
}

const EditProfile = ({storageService, onClose}: EditProfileProps) => {
    const [firstNameValue, setFirstNameValue] = useState<string>('');
    const [lastNameValue, setLastNameValue] = useState<string>('');
    const [weightValue, setWeightValue] = useState<number>(0);
    const [unitValue, setUnit] = useState<Unit>(Unit.Imperial);
    const [user, setUser] = useState<UserResponse>();
    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const weightFieldId = 'weight';
    const [form, setForm] = useState<Form>();

    useEffect(() => {
        const getUser = async () => {
            const response = await storageService.getUserById();
            setUser(response);
            setFirstNameValue(response.first_name);
            setLastNameValue(response.last_name);
            setWeightValue(response.weight);
            setUnit(response.unit);
            const firstNameField = new FirstNameField();
            firstNameField.value = response.first_name;
            const lastNameField = new LastNameField();
            lastNameField.value = response.last_name;
            const weightField = new WeightField();
            weightField.value = response.weight.toString();
            setForm(new Form(new Map<string, FormField>([
                [firstNameFieldId, firstNameField],
                [lastNameFieldId, lastNameField],
                [weightFieldId, weightField]
            ])));
        }
        getUser();
    }, [storageService]);

    const handleClose = () => {
        onClose();
    }

    const firstNameInputHandler = (event: any) => {
        form!.formFields.get(firstNameFieldId)!.value = event.target.value;
        setFirstNameValue(event.target.value);
    }

    const lastNameInputHandler = (event: any) => {
        form!.formFields.get(lastNameFieldId)!.value = event.target.value;
        setLastNameValue(event.target.value);
    }

    const weightInputHandler = (event: any) => {
        form!.formFields.get(weightFieldId)!.value = event.target.value;
        setWeightValue(parseInt(event.target.value))
    }

    const unitInputHandler = (event: any) => {
        if (event.target.checked) {
            setUnit(Unit.Metric);
        }
        else {
            setUnit(Unit.Imperial);
        }
    }

    const handleSave = async () => {
        if (form!.valid) {
            const userForm: UserForm = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: user!.email,
                id: user!.id,
                weight: weightValue,
                unit: unitValue
            };
            await storageService.editUser(userForm);
            onClose();
        }
        else {
            let errors: string[] = [];
            form!.formFields.forEach(f => f.errors.forEach(e => errors.push(e)));
            alert(errors.toString());
        }
    }

    return (
        <div className="edit-profile-container">
            <div className="text">First Name</div>
            <input
                className="edit-profile-input"
                value={firstNameValue}
                onChange={(event) => firstNameInputHandler(event)}
            />
            <div className="text">Last Name</div>
            <input
                className="edit-profile-input"
                value={lastNameValue}
                onChange={(event) => lastNameInputHandler(event)}
            />
            <div className="text">Weight</div>
            <input
                className="edit-profile-input"
                value={weightValue.toString()}
                onChange={(event) => weightInputHandler(event)}
                type="number"
            />
            <div className="unit-input-container">
                <div className="text">Metric Units</div>
                <input 
                    type="checkbox" 
                    onChange={unitInputHandler} 
                    checked={unitValue === Unit.Imperial ? false : true}/>
            </div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Cancel</button>
        </div>
    );
}

export default EditProfile;