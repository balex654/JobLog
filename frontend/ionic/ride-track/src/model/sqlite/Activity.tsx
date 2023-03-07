export class Activity {
    id?: number;
    userId: string = "";
    movingTime: number = 0;
    name: string = "default";
    startDate: Date = new Date();
    endDate: Date = new Date();
}