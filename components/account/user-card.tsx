"use client";

import { Avatar } from "@heroui/avatar";
import { Card } from "@heroui/card";
import React from "react";
import { Button } from "@heroui/button";
import { FaPencil } from "react-icons/fa6";
import Link from "next/link";
import { Role } from "@prisma/client";

import { EyeIcon } from "../icons";
import { useAuth } from "../auth-provider";

import dayjs from "@/lib/utils/dayjs";
import { UserT } from "@/types";

type Props = {
  user: UserT;
};

const UserCard = ({ user }: Props) => {
  const auth = useAuth();

  return (
    <Card fullWidth className="p-4 flex-row gap-4">
      <Avatar
        className="h-16 aspect-square min-w-max"
        radius="md"
        src={user.image_url || undefined}
      />
      <div className="text-start w-full flex flex-col gap-0.5">
        <p className="text-sm">{user.name}</p>
        <p className="text-xs text-foreground-500">
          NIK : {user.nik.toUpperCase()}
        </p>
        <p className="text-xs text-foreground-500">Role : {user.role}</p>
        <p className="text-xs text-foreground-500">
          Status :
          {user.active ? (
            <span className="text-success"> Masih Bekerja</span>
          ) : (
            <span className="text-danger"> Nonaktif</span>
          )}
        </p>
        <p className="text-xs text-foreground-500">
          Dibuat : {dayjs(user.created_at).format("DD/MM/YYYY")}
        </p>
      </div>
      <div className=" flex flex-col gap-1">
        <Button
          isIconOnly
          as={Link}
          href={`/account/${user.nik}`}
          size="sm"
          variant="flat"
        >
          <EyeIcon size={20} />
        </Button>
        {auth.hasRole(Role.Admin, Role.Leader) && (
          <Button isIconOnly size="sm" variant="flat">
            <FaPencil className="" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default UserCard;
