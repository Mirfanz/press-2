"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Alert } from "@heroui/alert";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import TaxCard from "../cash/tax-card";
import Navbar from "../navbar";
import { QuestionCircleIcon, ShareIcon } from "../icons";

import UserCard from "./user-card";

import { TaxT, UserT } from "@/types";
import queryClient from "@/lib/utils/query-client";

type Props = {};

const Profile = (props: Props) => {
  const { nik }: { nik: string } = useParams();
  const user = useQuery(
    {
      queryKey: ["user", nik],
      queryFn: async () => {
        const result = await axios.get(`/api/user/${nik}`);

        return result.data.data as UserT;
      },
    },
    queryClient,
  );
  const taxes = useQuery(
    {
      queryKey: ["unpaid-taxes", nik],
      queryFn: async () => {
        const result = await axios.get(`/api/user/${nik}/taxes`);

        return result.data.data as TaxT[];
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
            className="text-default"
            size="sm"
            variant="light"
            onPress={() =>
              window.navigator.share?.({
                title: "Profil " + (user.data?.name || ""),
                text: "Kunjungi detail profil di aplikasi",
                url: window.location.href,
              })
            }
          >
            <ShareIcon />
          </Button>
        }
        title="ACCOUNT"
      />
      <main className="">
        <div className="container py-4">
          {user.isLoading ? (
            <Skeleton className="h-32 rounded-xl shadow-xl" />
          ) : (
            <UserCard user={user.data!} />
          )}
          <div className="flex items-center justify-between mt-6 mb-1">
            <p className="text-sm font-semibold">Tagihan Uang Kas</p>
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => {}}
            >
              <QuestionCircleIcon size={20} />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {taxes.isLoading && (
              <div className="flex justify-center items-center gap-4 text-sm mt-4">
                <Spinner />
                Tunggu Sebentar...
              </div>
            )}
            {!taxes.isLoading && !taxes.data?.length ? (
              <Alert
                color="success"
                description="Terimakasih telah berpartisipasi dengan sangat baik. "
                title="Kas Sudah Dibayar"
                variant="faded"
              />
            ) : (
              taxes.data?.map((tax) => <TaxCard key={tax.id} tax={tax} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
