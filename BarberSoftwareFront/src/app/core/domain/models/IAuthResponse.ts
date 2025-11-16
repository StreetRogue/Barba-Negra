import { Role } from "./EnumAuthRoles";

export interface IAuthResponse {
    token: string;
    userId: string;
    role: Role
}

