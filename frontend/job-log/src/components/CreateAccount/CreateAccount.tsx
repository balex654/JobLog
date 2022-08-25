import "./CreateAccount.css";
import { UserForm } from "../../model/user/UserForm";
import { IStorageService } from "../../services/IStorageService";

interface CreateAccountProps {
    storageService: IStorageService;
}

const CreateAccount = ({storageService}: CreateAccountProps) => {
    let firstName = '';
    let lastName = '';
    let email = '';
    let password = '';
    let confirmPassword = '';

    const firstNameInputHandler = (event: any) => {
        firstName = event.target.value;
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
        const user: UserForm = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
        }
        const response = await storageService.createUser(user);
        console.log(response);
    }

    return (
        <div className='create-account'>
            <p className='title'>
                Create Account
            </p>
            <form className='form'>
                <input onChange={firstNameInputHandler} className='input' placeholder='First Name'/>
                <input onChange={lastNameInputHandler} className='input' placeholder='Last Name'/>
                <input onChange={emailInputHandler} className='input' placeholder='Email'/>
                <input onChange={passwordInputHandler} className='input' placeholder='Password'/>
                <input onChange={confirmPasswordInputHandler} className='input' placeholder='Confirm Password'/>
            </form>
            <button onClick={handleCreate} className='create-button'>
                Create
            </button>
        </div>
    );
}

export default CreateAccount;