"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import { FaQuestion } from "react-icons/fa6";
import { addToast } from "@heroui/toast";

import { usePopup } from "../popup-provider";
import Navbar from "../navbar";

import { TaxT, UserT } from "@/types";
import dayjs from "@/lib/utils/dayjs";
import queryClient from "@/lib/utils/query-client";

type Props = {};

const TaxDetail = (props: Props) => {
  const params = useParams<{ taxId: string }>();
  const popup = usePopup();
  const { data, isLoading, error } = useQuery(
    {
      queryKey: ["tax", params.taxId],
      queryFn: async () => {
        const resp = await axios.get(`/api/finance/tax/${params.taxId}`);

        return resp.data.data as TaxT<true>;
      },
    },
    queryClient,
  );

  const handleLunas = async (user: UserT) => {
    const ok = await popup.show({
      icon: <FaQuestion className="text-warning" size={75} />,
      title: "Konfirmasi?",
      description: `Konfirmasi ${user.name} sudah membayar kas bulan ini`,
      cancelButton: "Batalkan",
      confirmButton: "Ya, Lunas",
    });

    if (!ok) return;
    axios
      .post("/api/finance/tax/" + params.taxId, { nik: user.nik })
      .then((resp) => {
        addToast({ title: `${user.name} Lunas` });
        queryClient.invalidateQueries({ queryKey: ["tax", params.taxId] });
      })
      .catch((error) => {
        popup.show({
          title: "Terjadi Kesalan",
          description: `Gagal mengkonfirmasi pembayaran kas ${user.name}`,
        });
      });
  };

  return (
    <div>
      <Navbar title={"KAS BULANAN"} />
      {!!data && (
        <main className="container">
          <Card
            className="p-5 flex-row justify-between shadow-lg my-4"
            shadow="none"
          >
            <h3 className="uppercase text-primary font-bold">
              {dayjs(`${data.year}-${data.month}-01`).format("MMMM YYYY")}
            </h3>
            <p className="font-bold text-primary">
              Rp {(data.amount * data.paid_count).toLocaleString()}
            </p>
          </Card>
          <Card className="p-5 shadow-lg my-4" shadow="none">
            <h3 className="text-center font-medium text-base text-success-600">
              Member Sudah Bayar
            </h3>
            <Divider className="my-4" />
            <div className="flex flex-col gap-4">
              {data.paid_users.map((user) => (
                <div key={user.nik} className="flex items-center">
                  <User
                    avatarProps={{ src: user.image_url || "" }}
                    className="me-auto"
                    description={`${user.nik.toUpperCase()} | ${user.role}`}
                    name={user.name}
                  />
                </div>
              ))}
              {!data.paid_users.length && (
                <p className="text-center text-sm text-foreground-500">
                  Belum ada member yang bayar kas
                </p>
              )}
            </div>
          </Card>
          <Card className="p-5 shadow-lg my-4" shadow="none">
            <h3 className="text-center font-medium text-base text-danger">
              Member Belum Bayar
            </h3>
            <Divider className="my-4" />
            <div className="flex flex-col gap-4">
              {data.unpaid_users.map((user) => (
                <div key={user.nik} className="flex items-center">
                  <User
                    avatarProps={{ src: user.image_url || "" }}
                    className="me-auto"
                    description={`${user.nik.toUpperCase()} | ${user.role}`}
                    name={user.name}
                  />
                  <Button
                    color="primary"
                    size="sm"
                    variant="solid"
                    onPress={() => handleLunas(user)}
                  >
                    Lunas
                  </Button>
                </div>
              ))}
              {!data.unpaid_users.length && (
                <p className="text-center text-sm text-foreground-500">
                  Semua member sudah membayar kas bulan ini.
                </p>
              )}
            </div>
          </Card>
        </main>
      )}
    </div>
  );
};

export default TaxDetail;
