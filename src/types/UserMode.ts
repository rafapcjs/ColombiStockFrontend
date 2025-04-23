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
export interface UpdatePasswordModel {
  currentPassword: string;
  newPassword: string;
}

export type AuthCredentials = Pick<UserModel, "username" | "password">;
