"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import Link from "next/link";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useAuth } from "../auth-provider";

type Props = {};

const Login = (props: Props) => {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fields, setFields] = useState({
    nik: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const { name, value } = e.currentTarget;

    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    auth
      .login(fields.nik, fields.password)
      .then((result) => {
        if (!result) return;
        const redirectUrl = searchParams.get("redirect_url");

        if (redirectUrl) {
          const decodedUrl = decodeURIComponent(redirectUrl);

          router.replace(decodedUrl);
        } else router.replace("/account");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <main className="bg">
      <div className="p-4 h-dvh flex flex-col justify-end">
        <div className="m-auto">
          <div className="relative">
            <div className="w-52 h-52 absolute block bg-foreground-300 rounded-2xl" />
            <div className="w-52 h-52 block bg-primary rotate-45 rounded-2xl" />
          </div>
        </div>
        <p className="mb-2 text-3xl font-bold text-primary">Welcome...</p>
        <p className="mb-4 text-sm text-foreground-700">
          Selamat Datang di <strong>PRESS II</strong>, silahkan login terlebih
          dahulu. Terimakasih....
        </p>
        <Form
          className="flex flex-col gap-4 w-full mb-10"
          onSubmit={handleSubmit}
        >
          <Input
            fullWidth
            color="primary"
            label="NIK"
            labelPlacement="inside"
            name="nik"
            placeholder="NIK Karyawan"
            value={fields.nik}
            variant="bordered"
            onChange={handleFieldChange}
          />
          <Input
            fullWidth
            color="primary"
            endContent={
              <Button
                isIconOnly
                color="primary"
                size="sm"
                variant="light"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FaEye className="text-base" />
                ) : (
                  <FaEyeSlash className="text-base" />
                )}
              </Button>
            }
            label="Password"
            labelPlacement="inside"
            name="password"
            placeholder="Masukan Password"
            type={showPassword ? "text" : "password"}
            value={fields.password}
            variant="bordered"
            onChange={handleFieldChange}
          />
          <Button
            fullWidth
            className="mt-2"
            color="primary"
            isLoading={isLoading}
            size="lg"
            type="submit"
            variant="shadow"
          >
            LOGIN
          </Button>
        </Form>
        <p className="text-center text-sm">
          &copy; 2025 Created By{" "}
          <Link href={"https://instagram.com/mirfan.project"}>
            Mirfan.Project
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
