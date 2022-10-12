export abstract class FormField {

    private _value: string = '';

    public set value(value: string) {
        this._value = value;
        this.validate();
    };

    public get value(): string {
        return this._value;
    }
    
    public errors: string[] = [];
    
    public get valid(): boolean {
        if (this.errors.length === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    
    public abstract validate(): void;
}