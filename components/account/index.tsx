"use client";

import { Button } from "@heroui/button";
import React from "react";

import { useAuth } from "../auth-provider";
import Navbar from "../navbar";
import { LogoutIcon } from "../icons";

type Props = {};

const Account = (props: Props) => {
  const auth = useAuth();

  return (
    <main>
      <Navbar
        endContent={
          <Button isIconOnly size="sm" variant="light" onPress={auth.logout}>
            <LogoutIcon className="text-foreground-100" size={24} />
          </Button>
        }
        title="ACCOUNT"
      />
      <div className="container py-4" />
    </main>
  );
};

export default Account;
