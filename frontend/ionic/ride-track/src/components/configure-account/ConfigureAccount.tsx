import { IonContent, IonPage } from "@ionic/react";
import { useHistory } from "react-router";
import "./ConfigureAccount.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Form } from "../../common/Form";
import { FormField } from "../../common/FormField";
import { EmptyValidator, LengthValidator, NonFloatValueValidator } from "../../common/Validators";
import { UserForm } from "../../model/user/UserForm";
import { HttpStorageService } from "../../services/HttpStorageService";
import { Storage, Drivers } from "@ionic/storage";

const ConfigureAccount = () => {
    const history = useHistory();
    const { user } = useAuth0();
    const storageService = new HttpStorageService();
    const storage = new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    });
    storage.create();

    const [firstNameErrors, setFirstNameErrors] = useState<string[]>([]);
    const [lastNameErrors, setLastNameErrors] = useState<string[]>([]);
    const [weightErrors, setWeightErrors] = useState<string[]>([]);

    const [firstNameValue, setFirstName] = useState<string>('');
    const [lastNameValue, setLastName] = useState<string>('');
    const [weightValue, setWeight] = useState<string>('');

    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const weightFieldId = 'weight';
    const [form] = useState<Form>(new Form(new Map<string, FormField>([
        [firstNameFieldId, new FirstNameField()],
        [lastNameFieldId, new LastNameField()],
        [weightFieldId, new WeightField()]
    ])));

    const firstNameInputHandler = (event: any) => {
        form.formFields.get(firstNameFieldId)!.value = event.target.value;
        setFirstNameErrors(form.formFields.get(firstNameFieldId)!.errors);
        setFirstName(event.target.value);
    }

    const lastNameInputHandler = (event: any) => {
        form.formFields.get(lastNameFieldId)!.value = event.target.value;
        setLastNameErrors(form.formFields.get(lastNameFieldId)!.errors);
        setLastName(event.target.value);
    }

    const weightInputHandler = (event: any) => {
        form.formFields.get(weightFieldId)!.value = event.target.value;
        setWeightErrors(form.formFields.get(weightFieldId)!.errors);
        setWeight(event.target.value);
    }

    const handleCreate = async () => {
        if (form.valid) {
            const userForm: UserForm = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: user!.email!,
                id: user!.sub!,
                weight: parseFloat(weightValue)
            }
            const response = await storageService.createUser(userForm);
            storage.set('user', JSON.stringify(response));
            history.push('/tab-view');
        }
    }

    return (
        <IonPage>
            <IonContent>
                <div className="configure-account">
                    <p className="title">
                        Configure Account
                    </p>
                    <form className="form">
                        <div className="input-container">
                            <input onChange={firstNameInputHandler} className='input' placeholder='First Name'/>
                        </div>
                        {firstNameErrors.map(e => <div className="error">{e}</div>)}
                        <div className="input-container">
                            <input onChange={lastNameInputHandler} className='input' placeholder='Last Name'/>
                        </div>
                        {lastNameErrors.map(e => <div className="error">{e}</div>)}
                        <div className="input-container">
                            <input onChange={weightInputHandler} className='input' placeholder='Weight (kg)'/>
                        </div>
                        {weightErrors.map(e => <div className="error">{e}</div>)}
                    </form>
                    <div className='button-container'>
                        <button onClick={handleCreate} className='create-button'>
                            Configure
                        </button>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default ConfigureAccount;

export class FirstNameField extends FormField {
    private readonly emptyMessage: string = 'First name cannot be empty';
    private readonly lengthMessage: string = 'First name cannot be more than 200 characters';

    public validate(): void {
        this.errors = EmptyValidator(this.value, this.emptyMessage, this.errors);
        this.errors = LengthValidator(this.value, 200, this.lengthMessage, this.errors);
    }
}

export class LastNameField extends FormField {
    private readonly emptyMessage: string = 'Last name cannot be empty';
    private readonly lengthMessage: string = 'Last name cannot be more than 200 characters';

    public validate(): void {
        this.errors = EmptyValidator(this.value, this.emptyMessage, this.errors);
        this.errors = LengthValidator(this.value, 200, this.lengthMessage, this.errors);
   }
}

export class WeightField extends FormField {
    private readonly emptyMessage: string = 'Weight cannot be empty';
    private readonly nonNumberMessage: string = 'Weight can only be a number';

    public validate(): void {
        this.errors = EmptyValidator(this.value, this.emptyMessage, this.errors);
        this.errors = NonFloatValueValidator(this.value, this.nonNumberMessage, this.errors);
    }
}