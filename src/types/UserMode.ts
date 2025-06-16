export interface UserModel {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
  dni: string;
  phone: string;
  roleRequest: {
    roleListName: string[];
  };
}

export interface UserModelDto {
  username: string;
  email: string;
  dni: string;
  phone: string;
  lastName: string;
  enabled: boolean;
}


 export interface ChangePasswordFormData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

 export interface ChangePasswordEasy {
   newPassword: string
 }


export interface UpdatePasswordModel{
  newPassword: string
  confirmPassword: string
}

export type AuthCredentials = Pick<UserModel, "username" | "password">;
export type UserInSessionModel = Omit<UserModel, "password">;

export type UpdatePasswordUserInSessionModel = Omit<
  UserModel,
  "username" | "password" | "roleRequest"
>;
