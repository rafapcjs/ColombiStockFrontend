import { colombiStockApi } from "@/api";
import { AuthoritiesJwt } from "@/types/Authorities";
import {
  AuthCredentials,
  UpdatePasswordModel,
  UserModel,
} from "@/types/UserMode";
import { jwtDecode } from "jwt-decode";

export const singup = async (register: UserModel) => {
  const { data } = await colombiStockApi.post("/auth/sign-up", register);
  return data as UserModel;
};
export const login = async (login: AuthCredentials) => {
  const { data } = await colombiStockApi.post("/auth/login", login);

  localStorage.setItem("jwt", data.jwt);
  const decodedToken = jwtDecode<AuthoritiesJwt>(data.jwt);
  const authorities = decodedToken.authorities;

  return { ...data, authorities };
};

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
  const jwt = localStorage.getItem("jwt");

  const decodedToken = jwtDecode<AuthoritiesJwt>(jwt as string);
  return decodedToken.authorities;
};
