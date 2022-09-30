export interface IUser {
    _id: string;
    email: string;
    password: string;
    phoneNumber: string;
    fullName: string;
}

export type passportConfigUser = {
    _id?: number;
};
