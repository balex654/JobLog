import { FormField } from "./FormField";

export class Form {
    public formFields = new Map<string, FormField>();

    public get valid(): boolean {
        
        for (const key in this.formFields.keys) {
            if (!this.formFields.get(key)!.valid) {
                return false;
            }
        }

        return true;
    }

    constructor(formFields: Map<string, FormField>) {
        this.formFields = formFields;
    }
}