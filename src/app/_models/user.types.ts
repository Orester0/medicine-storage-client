  export interface UserRegistration {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    roles: string[];
 }
 
 export interface UserLogin {
    userName: string;
    password: string;
 }
 
 export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    roles: string[];
 }
 
 export interface UserUpdate {
    firstName: string;
    lastName: string;
    email: string;
 }
 
 export interface UserTokenReturn {
    userName: string;
    token: string;
 }

 export interface UserToken{
   token: string;
}
 
 export interface UserKnown {
    firstName: string;
    lastName: string;
    roles: string[];
 }
 
 export interface ChangePassword {
    userId: number;
    currentPassword: string;
    newPassword: string;
 }