"use client";

import { Button } from "@heroui/button";
import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@heroui/spinner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import {
  GalleryEditIcon,
  LockPasswordIcon,
  LogoutIcon,
  SettingIcon,
  UserPlusIcon,
} from "../icons";
import Navbar from "../navbar";
import { useAuth } from "../auth-provider";

import NewUserModal from "./new";
import ChangePasswordModal from "./change-password";
import UserCard from "./user-card";

import { UserT } from "@/types";
import queryClient from "@/lib/utils/query-client";
import dayjs from "@/lib/utils/dayjs";

type Props = {};

const Account = (props: Props) => {
  const auth = useAuth();
  const [searchField, setSearchField] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      {
        queryKey: ["users"],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => {
          const res = await axios.get("/api/user", {
            params: { page: pageParam },
          });

          console.log("res", res);

          return res.data;
        },
        getNextPageParam: (lastPage) => {
          if (lastPage.meta.totalPages > lastPage.meta.page)
            return lastPage.meta.page + 1;

          return undefined;
        },
      },
      queryClient,
    );

  return (
    <div>
      <Navbar
        endContent={
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={() => setShowAddModal(true)}
          >
            <UserPlusIcon className="text-foreground-100" />
          </Button>
        }
        title="ACCOUNT"
      />
      <main className="relative">
        {/* <div className="bg-primary p-6 pt-2 shadow-md rounded-b-2xl">
          <div className="flex gap-4 items-center">
            <Avatar size="lg" src={auth.user?.image_url || undefined} />
            <div className="">
              <h4 className="text-foreground-100 font-medium text-lg">{auth.user?.name}</h4>
              <p className="text-sm text-foreground-300">
                {auth.user?.nik.toUpperCase()} | {auth.user?.role}
              </p>
            </div>
            <Dropdown className="min-w-0">
              <DropdownTrigger>
                <Button isIconOnly className="ms-auto text-foreground-100" variant="flat">
                  <SettingIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu className="w-max">
                <DropdownItem key={"profil"} startContent={<GalleryEditIcon size={16} />}>
                  Ubah Foto
                </DropdownItem>
                <DropdownItem
                  key={"password"}
                  startContent={<LockPasswordIcon size={16} />}
                  onPress={() => setShowChangePassword(true)}
                >
                  Ganti Password
                </DropdownItem>
                <DropdownItem
                  key={"delete"}
                  className="text-danger"
                  color="danger"
                  startContent={<LogoutIcon size={16} />}
                  onPress={() => auth.logout()}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div> */}
        <div className="p-6 rounded-b-2xl flex w-full flex-row gap-4 bg-primary">
          <Avatar
            className="h-16 aspect-square min-w-max"
            radius="md"
            src={auth.user?.image_url || undefined}
          />
          <div className="text-start w-full flex flex-col gap-0.5">
            <p className="text-sm text-primary-foreground font-semibold mb-1">
              {auth.user?.name}
            </p>
            <p className="text-xs text-foreground-300">
              NIK : {auth.user?.nik.toUpperCase()}
            </p>
            <p className="text-xs text-foreground-300">
              Role : {auth.user?.role}
            </p>
            <p className="text-xs text-foreground-300">
              Status :
              {auth.user?.active ? (
                <span className="text-success"> Masih Bekerja</span>
              ) : (
                <span className="text-danger"> Nonaktif</span>
              )}
            </p>
            <p className="text-xs text-foreground-300">
              Dibuat : {dayjs(auth.user?.created_at).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Dropdown className="min-w-0">
              <DropdownTrigger>
                <Button isIconOnly color="warning" variant="light">
                  <SettingIcon size={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu className="w-max">
                <DropdownItem
                  key={"profil"}
                  startContent={<GalleryEditIcon size={16} />}
                >
                  Ubah Foto
                </DropdownItem>
                <DropdownItem
                  key={"password"}
                  startContent={<LockPasswordIcon size={16} />}
                  onPress={() => setShowChangePassword(true)}
                >
                  Ganti Password
                </DropdownItem>
                <DropdownItem
                  key={"delete"}
                  className="text-danger"
                  color="danger"
                  startContent={<LogoutIcon size={16} />}
                  onPress={() => auth.logout()}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button
              isIconOnly
              color="danger"
              size="md"
              variant="light"
              onPress={auth.logout}
            >
              <LogoutIcon size={24} />
            </Button>
          </div>
        </div>
        {/* <div className="flex gap-2 sticky top-16 mb-4 z-10 bg-background pt-4">
          <Input
            isClearable
            className="mb-6"
            color="primary"
            placeholder="Temukan sesuatu disini..."
            size="lg"
            startContent={<SearchIcon className="me-1" />}
            value={searchField}
            variant="flat"
            onValueChange={(val) => setSearchField(val)}
          />
        </div> */}
        <div className="container py-6">
          <div className="flex flex-col gap-3">
            {isLoading && <Spinner />}
            {data?.pages
              .flatMap((page) => page.data)
              .map((item: UserT) => <UserCard key={item.nik} user={item} />)}
            {hasNextPage && (
              <Button
                className="mx-auto my-2"
                isLoading={isFetchingNextPage}
                variant="flat"
                onPress={() => fetchNextPage()}
              >
                Show More
              </Button>
            )}
          </div>
        </div>
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
        />
        <NewUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </main>
    </div>
  );
};

export default Account;
