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
 
 export interface ReturnUserDTO {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    position?: string | null;
    email: string;
    roles: string[];
 }
 
 export interface UserUpdateDTO {
   firstName?: string | null;
   lastName?: string | null;
   position?: string | null; 
   email?: string | null;
 }
 
 export interface UserToken{
   token: string;
}
 
 export interface ChangePasswordDTO {
    userId: number;
    currentPassword: string;
    newPassword: string;
 }