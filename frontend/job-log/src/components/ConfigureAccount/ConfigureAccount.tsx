import "./ConfigureAccount.css";
import { UserForm } from "../../model/user/UserForm";
import { IStorageService } from "../../services/IStorageService";
import { FormField } from "../../common/FormField";
import { Form } from "../../common/Form";
import { useEffect, useState } from "react";
import { EmptyValidator, LengthValidator } from "../../common/Validators";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

interface ConfigureAccountProps {
    storageService: IStorageService;
}

const ConfigureAccount = ({storageService}: ConfigureAccountProps) => {
    const navigate = useNavigate();
    const { user, getAccessTokenSilently } = useAuth0();

    const [firstNameErrors, setFirstNameErrors] = useState<string[]>([]);
    const [lastNameErrors, setLastNameErrors] = useState<string[]>([]);

    const [firstNameValue, setFirstName] = useState<string>('');
    const [lastNameValue, setLastName] = useState<string>('');

    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const formMap = new Map<string, FormField>();
    formMap.set(firstNameFieldId, new FirstNameField());
    formMap.set(lastNameFieldId, new LastNameField());
    let form = new Form(formMap);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: "https://job-log-backend-gol2gz2rwq-uc.a.run.app",
                    scope: "read write"
                });
                localStorage.setItem('accessToken', accessToken);
            }
            catch (e) {
                console.log(e);
            }
        }
    
        const checkUserExists = async () => {
            try {
                await storageService.getUserByEmail();
                navigate('/dashboard');
            }
            catch (e) {
                setLoading(false)
            }
        }

        const init = async () => {
            await getAccessToken();
            await checkUserExists();
        }
        init()
    }, [getAccessTokenSilently, navigate, storageService]);

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

    const handleCreate = async (e: any) => {
        e.preventDefault();
        if (form.valid) {
            const userForm: UserForm = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: user!.email!
            }
            await storageService.createUser(userForm);
            navigate('/dashboard');
        }
    }

    if (loading) {
        return (
            <div>Loading...</div>
        );
    }
    else {
        return (
            <div className='configure-account'>
                <p className='title'>
                    Configure Account
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
                </form>
                <div className='button-container'>
                    <button onClick={handleCreate} className='create-button'>
                        Configure
                    </button>
                </div>
                
            </div>
        );
    }
}

export default ConfigureAccount;

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