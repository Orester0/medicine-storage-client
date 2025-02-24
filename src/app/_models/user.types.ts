  export interface UserRegistrationDTO {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    position?: string | null;
    company?: string | null;
    roles: string[];
 }
 
 export interface UserLoginDTO {
    userName: string;
    password: string;
 }

 export interface ReturnUserLoginDTO {
   returnUserTokenDTO: ReturnUserTokenDTO;
   returnUserDTO: ReturnUserPersonalDTO;
 }

 
 export interface ReturnUserTokenDTO{
  accessToken: string;
  refreshToken: string;
  }

  
 export interface UserRefreshTokenDTO{
  refreshToken: string;
}


 export interface ReturnUserPersonalDTO {
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


export interface ReturnUserGeneralDTO {
  id: number;
  firstName: string;
  lastName: string;
  position?: string | null;
  company?: string | null;
  photoBase64: string;
}

 export interface UserUpdateDTO {
   firstName?: string | null;
   lastName?: string | null;
   position?: string | null; 
   company?: string | null; 
   email?: string | null;
 }
 
 export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
 }

 export interface UserParams {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  email?: string | null;
  position?: string | null;
  company?: string | null;
  roles?: string[];  
  sortBy?: string;
  isDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}
