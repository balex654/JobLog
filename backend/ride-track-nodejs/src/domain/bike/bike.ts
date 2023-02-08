export class Bike {
    public name: string;
    public weight: number;
    public user_id: string;
    public is_deleted: boolean;
    public id?: number;

    constructor(name: string, weight: number, user_id: string, is_deleted: boolean, id?: number) {
        this.name = name;
        this.weight = weight;
        this.user_id = user_id;
        this.is_deleted = is_deleted;
        this.id = id;
    }
}