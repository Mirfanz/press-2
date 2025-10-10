"use client";

import { Button } from "@heroui/button";
import React, { useState } from "react";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Card } from "@heroui/card";
import { FaPencil, FaPlus, FaWhatsapp } from "react-icons/fa6";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@heroui/spinner";

import { GalleryEditIcon, LogoutIcon, SearchIcon } from "../icons";
import Navbar from "../navbar";
import { useAuth } from "../auth-provider";

import NewUserModal from "./new";

import { UserT } from "@/types";
import queryClient from "@/lib/utils/query-client";
import dayjs from "@/lib/utils/dayjs";

type Props = {};

const Account = (props: Props) => {
  const auth = useAuth();
  const [searchField, setSearchField] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
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
    <main>
      <div className="sticky top-0 z-50">
        <Navbar
          endContent={
            <Button isIconOnly size="sm" variant="light" onPress={auth.logout}>
              <LogoutIcon className="text-foreground-100" />
            </Button>
          }
          title="ACCOUNT"
        />
        <div className="bg-primary p-6 pt-2 shadow-md rounded-b-2xl">
          <div className="flex gap-4 items-center">
            <Avatar
              className=""
              imgProps={{ src: auth.user?.image_url || undefined }}
              size="lg"
            />
            <div className="">
              <h4 className="text-foreground-100 font-medium text-lg">
                {auth.user?.name}
              </h4>
              <p className="text-sm text-foreground-300">
                {auth.user?.nik.toUpperCase()} | {auth.user?.role}
              </p>
            </div>
            <Button
              isIconOnly
              className="ms-auto text-foreground-100"
              variant="flat"
            >
              <GalleryEditIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="container py-6">
        <div className="flex gap-2">
          <Input
            isClearable
            color="primary"
            placeholder="Temukan sesuatu disini..."
            size="lg"
            startContent={<SearchIcon className="me-1" />}
            value={searchField}
            variant="flat"
            onValueChange={(val) => setSearchField(val)}
          />
          <Button
            isIconOnly
            color="primary"
            size="lg"
            onPress={() => setShowAddModal(true)}
          >
            <FaPlus className="text-xl" />
          </Button>
        </div>
        <div className="flex flex-col gap-3 my-6">
          {isLoading && <Spinner />}
          {data?.pages
            .flatMap((page) => page.data)
            .map((item: UserT) => (
              <Card key={item.nik} fullWidth className="p-4 flex-row gap-4">
                <Avatar
                  className="h-16 aspect-square min-w-max"
                  imgProps={{ src: item.image_url || undefined }}
                  radius="md"
                />
                <div className="text-start w-full flex flex-col gap-0.5">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-foreground-500">
                    NIK : {item.nik.toUpperCase()}
                  </p>
                  <p className="text-xs text-foreground-500">
                    Role : {item.role}
                  </p>
                  <p className="text-xs text-foreground-500">
                    Status :
                    {item.active ? (
                      <span className="text-success"> Masih Bekerja</span>
                    ) : (
                      <span className="text-danger"> Nonaktif</span>
                    )}
                  </p>
                  <p className="text-xs text-foreground-500">
                    Dibuat : {dayjs(item.created_at).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div className=" flex flex-col gap-1">
                  <Button isIconOnly size="sm" variant="flat">
                    <FaWhatsapp className="text-lg" />
                  </Button>
                  <Button isIconOnly size="sm" variant="flat">
                    <FaPencil className="" />
                  </Button>
                </div>
              </Card>
            ))}
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
      <NewUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </main>
  );
};

export default Account;
