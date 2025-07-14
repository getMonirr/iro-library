import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    password: string;
    role: "admin" | "librarian" | "member";
    profilePicture?: string;
    isActive: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    emailVerificationToken?: string;
    phoneVerificationCode?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    lastLogin?: Date;
    loginAttempts: number;
    lockUntil?: Date;
    preferences: {
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
        language: string;
        theme: "light" | "dark";
    };
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    dateOfBirth?: Date;
    occupation?: string;
    membershipDate: Date;
    membershipStatus: "active" | "suspended" | "expired";
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generatePasswordResetToken(): string;
    isLocked: boolean;
    incLoginAttempts(): Promise<IUser>;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map