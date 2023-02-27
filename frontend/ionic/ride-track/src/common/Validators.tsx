export function EmptyValidator(value: string, message: string, errors: string[]): string[] {
    if (value === '') {
        return AddToList(message, errors);
    }
    else {
        return RemoveFromList(message, errors);
    }
}

export function LengthValidator(value: string, length: number, message: string, errors: string[]): string[] {
    if (value.length > length) {
        return AddToList(message, errors);
    }
    else {
        return RemoveFromList(message, errors);
    }
}

export function NonNegativeValidator(value: string, message: string, errors: string[]): string[] {
    const numValue = Number.isNaN(parseInt(value)) ? 0 : parseInt(value);
    if (numValue < 0) {
        return AddToList(message, errors);
    }
    else {
        return RemoveFromList(message, errors);
    }
}

export function MatchValidator(value1: string, value2: string, message: string, errors: string[]): string[] {
    if (value1 !== value2) {
        return AddToList(message, errors);
    }
    else {
        return RemoveFromList(message, errors);
    }
}

export function MinLengthValidator(value: string, length: number, message: string, errors: string[]): string[] {
    if (value.length < length) {
        return AddToList(message, errors);
    }
    else {
        return RemoveFromList(message, errors);
    }
}

export function SpecialCharsValidator(value: string, message: string, errors: string[]): string[] {
    const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (specialChars.test(value)) {
        return RemoveFromList(message, errors);
    }
    else {
        return AddToList(message, errors);
    }
}

export function CapitalLettersValidator(value: string, message: string, errors: string[]): string[] {
    const capitalLetter = /[A-Z]/;
    if (capitalLetter.test(value)) {
        return RemoveFromList(message, errors);
    }
    else {
        return AddToList(message, errors);
    }
}

export function NonFloatValueValidator(value: string, message: string, errors: string[]): string[] {
    const floatValue = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    if (floatValue.test(value)) {
        return RemoveFromList(message, errors);
    }
    else {
        return AddToList(message, errors);
    }
}

function AddToList(message: string, list: string[]): string[] {
    if (!list.includes(message)) {
        list.push(message);
    }
    return list;
}

function RemoveFromList(message: string, list: string[]): string[] {
    if (list.includes(message)) {
        let newList: string[] = [];
        list.forEach(e => {
            if (e !== message) {
                newList.push(e);
            }
        });
        return newList;
    }
    else {
        return list;
    }
}