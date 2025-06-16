import { colombiStockApi } from "@/api";
import { AuthoritiesJwt } from "@/types/Authorities";
import {
  AuthCredentials,
  ChangePasswordEasy,
  UpdatePasswordModel,
  UpdatePasswordUserInSessionModel,
  UserInSessionModel,
  UserModel,
  UserModelDto,
} from "@/types/UserMode";
import { jwtDecode } from "jwt-decode";

export const singup = async (register: UserModel) => {
  const { data } = await colombiStockApi.post("/auth/sign-up", register);
  return data as UserModel;
};
export const login = async (login: AuthCredentials) => {
  const { data } = await colombiStockApi.post("/auth/login", login);

  sessionStorage.setItem("jwt", data.jwt);
  const decodedToken = jwtDecode<AuthoritiesJwt>(data.jwt);
  const authorities = decodedToken.authorities;

  return { ...data, authorities };
};

// GET con query param

export const recoverPasswordFormGmail = async (email: string) => {
  const { data } = await colombiStockApi.post("/auth/recover-password", {
    email,
  });
  return data;
};
export const UpdatePassword = async (
  updateRegisterPassword: UpdatePasswordModel
) => {
  const { data } = await colombiStockApi.put(
    "/auth/change-password",
    updateRegisterPassword
  );

  return data as UpdatePasswordModel;
};

export const getAuthorities = () => {
  const jwt = sessionStorage.getItem("jwt");

  const decodedToken = jwtDecode<AuthoritiesJwt>(jwt as string);
  return decodedToken.authorities;
};

export const getUserInSession = async () => {
  const { data } = await colombiStockApi.get("/auth/me");
  return data as UserInSessionModel;
};

export const updateUserInSession = async (
  user: UpdatePasswordUserInSessionModel
) => {
  const { data } = await colombiStockApi.put("/auth/updateInfo-user", user);

  return data as UpdatePasswordUserInSessionModel;
};


/** Llama al endpoint y borra el JWT local */
export const closeSession = async () => {
  const { data } = await colombiStockApi.get("/auth/logout", {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("jwt")}` },
  });

  sessionStorage.removeItem("jwt");  // limpia token en el cliente
  return data;                     // por si el backend devuelve algo
};


export const createUserShopkeeper = async (user: UserModel) => {

  const { data } = await colombiStockApi.post("/auth/sign-up", user);

  return data as UserModel;
}




export const DeleteUsers = async (dni: string): Promise<void> => {
  const { data } = await colombiStockApi.delete(`/auth/delete/${dni}`);
  return data;
};

export const GetAllShopkeepers = async () => {
  const { data } = await colombiStockApi.get("/auth/getShopKeepers");
  return data as UserModelDto[];

}


export const UpdateStateActive = async (dni: string) => {
  const { data } = await colombiStockApi.put(`/auth/active-accounts/${dni}/activate`);
  return data;
};

export const UpdateStateDesactive = async (dni: string) => {
  const { data } = await colombiStockApi.put(`/auth/active-accounts/${dni}/deactivate`);
  return data;
};



export const UpdateUserPasswordEasy = async (dni: string, password_easy: ChangePasswordEasy) => {
  const { data } = await colombiStockApi.put(`/auth/change-password_easy/${dni}`, password_easy);
  return data;
};
