import "./CreateAccount.css";
import { UserForm } from "../../model/user/UserForm";
import { IStorageService } from "../../services/IStorageService";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../../common/FormField";
import { Form } from "../../common/Form";
import { useState } from "react";

interface CreateAccountProps {
    storageService: IStorageService;
}

const CreateAccount = ({storageService}: CreateAccountProps) => {
    const navigate = useNavigate();

    const firstNameFieldId = 'firstName';
    const formMap = new Map<string, FormField>();
    formMap.set(firstNameFieldId, new FirstNameField());
    let form = new Form(formMap);

    const [firstNameErrors, setFirstNameErrors] = useState<string[]>([]);

    let lastName = '';
    let email = '';
    let password = '';
    let confirmPassword = '';

    const firstNameInputHandler = (event: any) => {
        form.formFields.get(firstNameFieldId)!.value = event.target.value;
        setFirstNameErrors(form.formFields.get(firstNameFieldId)!.errors);
    }

    const lastNameInputHandler = (event: any) => {
        lastName = event.target.value;
    }

    const emailInputHandler = (event: any) => {
        email = event.target.value;
    }

    const passwordInputHandler = (event: any) => {
        password = event.target.value;
    }

    const confirmPasswordInputHandler = (event: any) => {
        confirmPassword = event.target.value;
    }

    const handleCreate = async (e: any) => {
        e.preventDefault();
        if (form.valid) {
            const user: UserForm = {
                first_name: form.formFields.get(firstNameFieldId)!.value,
                last_name: lastName,
                email: email,
                password: password,
            }
            const response = await storageService.createUser(user);
            localStorage.setItem('user', JSON.stringify(response));
            navigate('/dashboard');
        }
    }

    return (
        <div className='create-account'>
            <p className='title'>
                Create Account
            </p>
            <form className='form'>
                <input onChange={firstNameInputHandler} className='input' placeholder='First Name'/>
                {firstNameErrors.map(e =>
                    <div>{e}</div>
                )}
                <input onChange={lastNameInputHandler} className='input' placeholder='Last Name'/>
                <input onChange={emailInputHandler} className='input' placeholder='Email'/>
                <input onChange={passwordInputHandler} className='input' placeholder='Password'/>
                <input onChange={confirmPasswordInputHandler} className='input' placeholder='Confirm Password'/>
            </form>
            <div className='button-container'>
                <button onClick={handleCreate} className='create-button'>
                    Create
                </button>
                <p className='text'>
                    Already have an account?
                </p>
                <p className='text'>
                    <Link to="/">Login</Link>
                </p>
            </div>
            
        </div>
    );
}

export default CreateAccount;

class FirstNameField extends FormField {
    private readonly emptyMessage: string = 'First name cannot be empty';
    private readonly lengthMessage: string = 'First name cannot be more than 200 characters';

    public validate(): void {
        if (this.value === '') {
            AddToList(this.emptyMessage, this.errors);
        }
        else {
            RemoveFromList(this.emptyMessage, this.errors);
        }

        if (this.value.length > 200) {
            AddToList(this.lengthMessage, this.errors);
        }
        else {
            RemoveFromList(this.lengthMessage, this.errors);
        }
    }
}

function AddToList(message: string, list: string[]): void {
    if (!list.includes(message)) {
        list.push(message);
    }
}

function RemoveFromList(message: string, list: string[]): void {
    if (list.includes(message)) {
        list = list.filter(e => e === message);
    }
}