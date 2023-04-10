import { IonCheckbox, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
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
import { LocalStorageCache, useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { Browser } from '@capacitor/browser';
import { Unit } from "../../model/user/Unit";
import { ConvertKilosToPounds, ConvertPoundsToKilos, GetWeightValueByUnit } from "../../common/Calculations";

const Profile = () => {
    const { logout, isLoading, isAuthenticated } = useAuth0();
    const history = useHistory();
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const [firstNameValue, setFirstNameValue] = useState<string>("");
    const [lastNameValue, setLastNameValue] = useState<string>("");
    const [weightValue, setWeightValue] = useState<string>("");
    const [user, setUser] = useState<UserResponse>();
    const [unitValue, setUnit] = useState<Unit>(Unit.Imperial);
    const firstNameFieldId = 'firstName';
    const lastNameFieldId = 'lastName';
    const weightFieldId = 'weight';
    const [form, setForm] = useState<Form>();
    const [storage] = useState<Storage>(new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    }));
    storage.create();

    const getUser = async () => {
        const user = (await storageService.getUserById()).resource!;
        await storage.set('user', JSON.stringify(user));
        const weightValue = GetWeightValueByUnit(user.weight, user.unit);
        setUser(user);
        setFirstNameValue(user.first_name);
        setLastNameValue(user.last_name);
        setWeightValue(weightValue.toString());
        setUnit(user.unit);
        const firstNameField = new FirstNameField();
        firstNameField.value = user.first_name;
        const lastNameField = new LastNameField();
        lastNameField.value = user.last_name;
        const weightField = new WeightField();
        weightField.value = weightValue.toString();
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
            const cache = new LocalStorageCache();
            const keys = cache.allKeys();
            keys.forEach(k => {
                cache.remove(k);
            });
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

    const unitInputHandler = (event: any) => {
        let newWeightValue;
        const weight = parseFloat(weightValue);
        if (event.target.checked) {
            setUnit(Unit.Metric);
            newWeightValue = ConvertPoundsToKilos(weight);
        }
        else {
            setUnit(Unit.Imperial);
            newWeightValue = ConvertKilosToPounds(weight);
        }
        form!.formFields.get(weightFieldId)!.value = newWeightValue.toString();
        setWeightValue(newWeightValue.toString());
    }

    const handleSave = async () => {
        if (form!.valid) {
            const weight = parseFloat(weightValue);
            const weightInUserUnits = unitValue === Unit.Imperial ? ConvertPoundsToKilos(weight) : weight;
            const userForm: UserForm = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: user!.email,
                id: user!.id,
                weight: weightInUserUnits,
                unit: unitValue
            };
            const response = (await storageService.editUser(userForm)).resource;
            await storage.set('user', JSON.stringify(response));
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
                    <IonToolbar>
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
                    <p className="text">{unitValue === Unit.Imperial ? "Weight (lbs)" : "Weight (kg)"}</p>
                    <input 
                        type="number"
                        onChange={(event) => weightInputHandler(event)}
                        value={weightValue}/>
                    <div className="unit-input-container input-container">
                        <div className="text">Metric Units</div>
                        <IonCheckbox 
                            checked={unitValue === Unit.Imperial ? false : true}
                            onIonChange={unitInputHandler}/>
                    </div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Profile;