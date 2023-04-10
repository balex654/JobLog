export interface DataField<T> {
    data: T;
    setValueFunction: Function;
    generateValue(): void;
}