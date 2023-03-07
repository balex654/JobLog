export const ConvertSQLiteDateToObject = (dateStr: string): Date => {
    const dateStrComponents = dateStr.split(" ");
    const dateParts = dateStrComponents[0].split("-");
    const timeParts = dateStrComponents[1].split(":");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);
    const second = parseInt(timeParts[2]);
    return new Date(year, month, day, hour, minute, second);
}