  export interface UserRegistration {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    roles: string[];
 }
 
 export interface UserLoginDTO {
    userName: string;
    password: string;
 }
 
 export interface ReturnUserLoginDTO {
   returnUserTokenDTO: ReturnUserTokenDTO;
   returnUserDTO: ReturnUserDTO;
 }
 export interface UserUpdateDTO {
   firstName?: string | null;
   lastName?: string | null;
   position?: string | null; 
   company?: string | null; 
   email?: string | null;
 }

 export interface ReturnUserDTO {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  position?: string | null;
  company?: string | null;
  email: string;
  roles: string[];
  photoBase64: string;
}

 
 export interface ReturnUserTokenDTO{
   accessToken: string;
   refreshToken: string;
   }

   
 export interface UserRefreshTokenDTO{
   refreshToken: string;
}
 
 
 export interface ChangePasswordDTO {
    userId: number;
    currentPassword: string;
    newPassword: string;
 }