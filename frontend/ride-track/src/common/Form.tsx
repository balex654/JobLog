import { FormField } from "./FormField";

export class Form {
    public formFields = new Map<string, FormField>();

    public get valid(): boolean {
        for (let item of this.formFields) {
            if (!item[1].valid) {
                return false;
            }
        }

        return true;
    }

    constructor(formFields: Map<string, FormField>) {
        this.formFields = formFields;
    }
}