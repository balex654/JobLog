import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
import { useEffect, useState } from "react";
import { HttpStorageService } from "../../services/HttpStorageService";
import "./Profile.css";
import { Keyboard, KeyboardResize } from '@capacitor/keyboard'
import { Form } from "../../common/Form";
import { UserResponse } from "../../model/user/UserResponse";
import { FirstNameField, LastNameField, WeightField } from "../configure-account/ConfigureAccount";
import { FormField } from "../../common/FormField";
import { UserForm } from "../../model/user/UserForm";
import { Storage, Drivers } from "@ionic/storage";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { Browser } from '@capacitor/browser';

const Profile = () => {
    const { logout, isLoading, isAuthenticated } = useAuth0();
    const history = useHistory();
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const [firstNameValue, setFirstNameValue] = useState<string>("");
    const [lastNameValue, setLastNameValue] = useState<string>("");
    const [weightValue, setWeightValue] = useState<string>("");
    const [user, setUser] = useState<UserResponse>();
    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const weightFieldId = 'weight';
    const [form, setForm] = useState<Form>();
    const [storage] = useState<Storage>(new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    }))
    storage.create();

    const getUser = async () => {
        const user = (await storageService.getUserById()).resource!;
        setUser(user);
        setFirstNameValue(user.first_name);
        setLastNameValue(user.last_name);
        setWeightValue(user.weight.toString());
        const firstNameField = new FirstNameField();
        firstNameField.value = user.first_name;
        const lastNameField = new LastNameField();
        lastNameField.value = user.last_name;
        const weightField = new WeightField();
        weightField.value = user.weight.toString();
        setForm(new Form(new Map<string, FormField>([
            [firstNameFieldId, firstNameField],
            [lastNameFieldId, lastNameField],
            [weightFieldId, weightField]
        ])));
    };

    useIonViewDidEnter(() => {
        Keyboard.setResizeMode({mode: KeyboardResize.None});
        getUser();
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            storage.clear();
            history.push('/');
        }
    }, [isLoading, isAuthenticated, history, storage])

    useIonViewDidLeave(() => {
        Keyboard.setResizeMode({mode: KeyboardResize.Native});
    });

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
        setWeightValue(event.target.value);
    }

    const handleSave = async () => {
        if (form!.valid) {
            const userForm: UserForm = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: user!.email,
                id: user!.id,
                weight: parseFloat(weightValue)
            };
            await storageService.editUser(userForm);
            alert("Profile Saved");
        }
        else {
            let errors: string[] = [];
            form!.formFields.forEach(f => f.errors.forEach(e => errors.push(e)));
            alert(errors.toString());
        }
    }

    const handleLogout = async () => {
        if (process.env.REACT_APP_ENV === "dev") {
            storage.clear();
            history.push('/');
        }
        else {
            await logout({
                logoutParams: {
                    returnTo: 'com.benalexander.Ride-Track://dev-2uer6jn7.us.auth0.com/capacitor/com.benalexander.Ride-Track/callback'
                },
                async openUrl(url) {
                    await Browser.open({
                        url,
                        windowName: "_self"
                    })
                }
            });
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        {`${firstNameValue === "" ? "" : firstNameValue + "'s "}Profile`}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar size-="large">
                        <IonTitle size="large">
                            {`${firstNameValue === "" ? "" : firstNameValue + "'s "}Profile`}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="profile-container">
                    <p className="text">First Name</p>
                    <input
                        onChange={(event) => firstNameInputHandler(event)} 
                        value={firstNameValue}/>
                    <p className="text">Last Name</p>
                    <input 
                        onChange={(event) => lastNameInputHandler(event)}
                        value={lastNameValue}/>
                    <p className="text">Weight</p>
                    <input 
                        type="number"
                        onChange={(event) => weightInputHandler(event)}
                        value={weightValue}/>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Profile;