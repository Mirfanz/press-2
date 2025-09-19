"use client";

import axios from "axios";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { CheckReadIcon, CloseSquareIcon, LogoutIcon } from "./icons";

import { UserT } from "@/types";
import SwalContent, { mySwal } from "@/lib/utils/my-swal";

type AuthProps = {
  user: UserT | null;
  login: (nik: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  hasRole: (...role: string[]) => boolean;
};
const AuthContext = createContext<AuthProps | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<UserT | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hasRole = (...roles: string[]) => {
    if (!user) return false;

    return roles.includes(user.role);
  };

  const login = (nik: string, password: string) =>
    axios
      .post<any>("/api/auth/login", {
        nik,
        password,
      })
      .then((resp) => {
        setUser(resp.data.data.user);
        mySwal.fire(
          <SwalContent
            description={`Halo ${resp.data.data.user.name}`}
            icon={<CheckReadIcon className="w-16 h-16 text-success" />}
            title="Selamat Datang"
          />,
        );

        return true;
      })
      .catch((err) => {
        mySwal.fire(
          <SwalContent
            description="Pastikan nik dan password yang anda masukan benar"
            icon={<CloseSquareIcon className="w-16 h-16 text-danger" />}
            title="Login Gagal"
          />,
        );

        return false;
      });

  const logout = async () => {
    const { isConfirmed } = await mySwal.fire(
      <SwalContent
        cancelButton="Batal"
        confirmButton="Logout"
        description={`Apakah anda yakin ingin keluar dari akun ${user?.name}`}
        icon={<LogoutIcon className="w-14 h-14 text-danger" />}
        title="Yakin Logout?"
      />,
    );

    if (!isConfirmed) return false;

    return axios
      .post("/api/auth/logout")
      .then(() => {
        setUser(null);
        addToast({
          description: "Logout akun",
          color: "default",
          icon: <LogoutIcon className="" />,
        });
        router.refresh();

        return true;
      })
      .catch((err) => {
        return false;
      });
  };

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((resp) => {
        if (!resp.data.success) return;
        setUser(resp.data.data.user);
      })
      .catch((err) => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        error,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) throw new Error("useAuth harus di dalam AuthProvider");

  return authContext;
};
