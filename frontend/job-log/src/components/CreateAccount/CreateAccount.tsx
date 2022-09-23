import "./CreateAccount.css";
import { UserForm } from "../../model/user/UserForm";
import { IStorageService } from "../../services/IStorageService";
import { Link, useNavigate } from "react-router-dom";
import { FormField } from "../../common/FormField";
import { Form } from "../../common/Form";
import { useState } from "react";
import { CapitalLettersValidator, EmptyValidator, LengthValidator, MatchValidator, MinLengthValidator, SpecialCharsValidator } from "../../common/Validators";

interface CreateAccountProps {
    storageService: IStorageService;
}

let PasswordValue: string = '';

const CreateAccount = ({storageService}: CreateAccountProps) => {
    const navigate = useNavigate();

    const [firstNameErrors, setFirstNameErrors] = useState<string[]>([]);
    const [lastNameErrors, setLastNameErrors] = useState<string[]>([]);
    const [emailErrors, setEmailErrors] = useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<string[]>([]);

    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const emailFieldId = 'email';
    const passwordFieldId = 'password';
    const confirmPasswordFieldId = 'confirmPassword';
    const formMap = new Map<string, FormField>();
    formMap.set(firstNameFieldId, new FirstNameField());
    formMap.set(lastNameFieldId, new LastNameField());
    formMap.set(emailFieldId, new EmailField());
    formMap.set(passwordFieldId, new PasswordField());
    formMap.set(confirmPasswordFieldId, new ConfirmPasswordField());
    let form = new Form(formMap);

    const firstNameInputHandler = (event: any) => {
        form.formFields.get(firstNameFieldId)!.value = event.target.value;
        setFirstNameErrors(form.formFields.get(firstNameFieldId)!.errors);
    }

    const lastNameInputHandler = (event: any) => {
        form.formFields.get(lastNameFieldId)!.value = event.target.value;
        setLastNameErrors(form.formFields.get(lastNameFieldId)!.errors);
    }

    const emailInputHandler = (event: any) => {
        form.formFields.get(emailFieldId)!.value = event.target.value;
        setEmailErrors(form.formFields.get(emailFieldId)!.errors);
    }

    const passwordInputHandler = (event: any) => {
        form.formFields.get(passwordFieldId)!.value = event.target.value;
        setPasswordErrors(form.formFields.get(passwordFieldId)!.errors);
        PasswordValue = event.target.value;
    }

    const confirmPasswordInputHandler = (event: any) => {
        form.formFields.get(confirmPasswordFieldId)!.value = event.target.value;
        setConfirmPasswordErrors(form.formFields.get(confirmPasswordFieldId)!.errors);
    }

    const handleCreate = async (e: any) => {
        e.preventDefault();
        if (form.valid) {
            const user: UserForm = {
                first_name: form.formFields.get(firstNameFieldId)!.value,
                last_name: form.formFields.get(lastNameFieldId)!.value,
                email: form.formFields.get(emailFieldId)!.value,
                password: form.formFields.get(passwordFieldId)!.value,
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
                <div className="input-container">
                    <input onChange={firstNameInputHandler} className='input' placeholder='First Name'/>
                </div>
                {firstNameErrors.map(e => <div className="error">{e}</div>)}
                <div className="input-container">
                    <input onChange={lastNameInputHandler} className='input' placeholder='Last Name'/>
                </div>
                {lastNameErrors.map(e => <div className="error">{e}</div>)}
                <div className="input-container">
                    <input onChange={emailInputHandler} className='input' placeholder='Email'/>
                </div>
                {emailErrors.map(e => <div className="error">{e}</div>)}
                <div className="input-container">
                    <input onChange={passwordInputHandler} className='input' placeholder='Password'/>
                </div>
                {passwordErrors.map(e => <div className="error">{e}</div>)}
                <div className="input-container">
                    <input onChange={confirmPasswordInputHandler} className='input' placeholder='Confirm Password'/>
                </div>
                {confirmPasswordErrors.map(e => <div className="error">{e}</div>)}
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
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        LengthValidator(this.value, 200, this.lengthMessage, this.errors);
    }
}

class LastNameField extends FormField {
    private readonly emptyMessage: string = 'Last name cannot be empty';
    private readonly lengthMessage: string = 'Last name cannot be more than 200 characters';

    public validate(): void {
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        LengthValidator(this.value, 200, this.lengthMessage, this.errors);
   }
}

class EmailField extends FormField {
    private readonly emptyMessage: string = 'Email cannot be empty';
    private readonly lengthMessage: string = 'Email cannot be more than 200 characters';

    public validate(): void {
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        LengthValidator(this.value, 200, this.lengthMessage, this.errors);
   }
}

class PasswordField extends FormField {
    private readonly emptyMessage: string = 'Password cannot be empty';
    private readonly maxLengthMessage: string = 'Password cannot be more than 200 characters';
    private readonly minLengthMessage: string = 'Password cannot be less than 8 characters';
    private readonly specialCharsMessage: string = 'Password must contain at least one special character';
    private readonly capitalLettersMessage: string = 'Password must contain at least one capital letter';

    public validate(): void {
        EmptyValidator(this.value, this.emptyMessage, this.errors);
        LengthValidator(this.value, 200, this.maxLengthMessage, this.errors);
        MinLengthValidator(this.value, 8, this.minLengthMessage, this.errors);
        SpecialCharsValidator(this.value, this.specialCharsMessage, this.errors);
        CapitalLettersValidator(this.value, this.capitalLettersMessage, this.errors);
   }
}

class ConfirmPasswordField extends FormField {
    private readonly mismatchMessage: string = 'Confirm password does not match password';

    public validate(): void {
        MatchValidator(this.value, PasswordValue, this.mismatchMessage, this.errors);
    }
}