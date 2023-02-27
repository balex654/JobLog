import { FormField } from "./FormField";

export class Form {
    public formFields = new Map<string, FormField>();

    public get valid(): boolean {
        let isValid = true;
        this.formFields.forEach((value, _) => {
            if (!value.valid) {
                isValid = false
            }
        });

        return isValid;
    }

    constructor(formFields: Map<string, FormField>) {
        this.formFields = formFields;
    }
}