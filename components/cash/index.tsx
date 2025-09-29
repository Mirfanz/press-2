"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { addToast } from "@heroui/toast";
import Link from "next/link";

import Navbar from "../navbar";
import { HandMoneyIcon, TrashIcon } from "../icons";
import { usePopup } from "../popup-provider";
import { useAuth } from "../auth-provider";

import Transaction from "./transaction";
import AddModal from "./add-modal";
import DetailModal from "./detail-modal";

import queryClient from "@/lib/utils/query-client";
import { TransactionT } from "@/types";
import dayjs from "@/lib/utils/dayjs";

type Props = {};

let lastdate = dayjs("2000-01-01");

const Cash = (props: Props) => {
  const popup = usePopup();
  const auth = useAuth();
  const { data: balance } = useQuery(
    {
      queryKey: ["balance"],
      queryFn: async () => {
        const res = await axios.get("/api/finance");

        return res.data.data.balance;
      },
      initialData: 0,
    },
    queryClient,
  );
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [shownDetail, setShownDetail] = React.useState<TransactionT | null>(
    null,
  );

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, refetch } =
    useInfiniteQuery(
      {
        queryKey: ["transactions"],
        queryFn: async ({ pageParam = 1 }) => {
          const res = await axios.get(
            `/api/finance/transaction?page=${pageParam}`,
          );

          return res.data;
        },
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.meta.page < lastPage.meta.totalPages)
            return lastPage.meta.page + 1;

          return undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        enabled: true,
      },
      queryClient,
    );

  const deleteTransaction = async (id: string) => {
    if (
      !(await popup.show({
        title: "Hapus Transaksi",
        description: "Data yang sudah dihapus tidak dapat dikembalikan",
        icon: TrashIcon,
        iconColor: "danger",
        confirmButton: "Hapus",
        cancelButton: "Batal",
        confirmColor: "danger",
      }))
    )
      return;
    axios
      .delete(`/api/finance/transaction`, {
        data: { id },
      })
      .then((resp) => {
        setShownDetail(null);
        addToast({ title: "Transaksi Dihapus" });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["balance"] });
      })
      .catch((error) => {
        addToast({ title: "Gagal Menghapus Transaksi", color: "danger" });
        console.error("Failed to delete transaction:", error);
      });
  };

  return (
    <div>
      <div className="sticky top-0 z-50">
        <Navbar
          endContent={
            <>
              {auth.hasRole("Admin", "Bendahara") && (
                <Button
                  isIconOnly
                  className="text-foreground-100"
                  size="sm"
                  variant="bordered"
                  onPress={() => setIsAddModalOpen(true)}
                >
                  <FaPlus size={18} />
                </Button>
              )}
              <Button
                isIconOnly
                as={Link}
                className=""
                href="/cash/tax"
                size="sm"
              >
                <HandMoneyIcon />
              </Button>
            </>
          }
          title="KEUANGAN"
        />
        <div className="relative">
          <div className="absolute block bg-primary h-14 w-full rounded-b-xl" />
          <div className="bg-white flex flex-col gap-1.5 justify-center items-center mx-6 relative h-24 rounded-2xl border-2 border-primary">
            <p className="text-sm text-foreground-500">Sisa Saldo :</p>
            <p className="font-bold text-3xl text-primary">
              Rp {balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <main>
        <div className="container my-4">
          <div className="flex flex-col gap-3">
            {data?.pages
              .flatMap((page) => page.data)
              .map((item: TransactionT, id) => {
                const itemDate = dayjs(item.created_at);
                const changeDate = !id || !itemDate.isSame(lastdate, "date");

                if (changeDate) lastdate = itemDate;

                return (
                  <div key={item.id} className="w-full">
                    {changeDate && (
                      <p className="text-center mt-2 mb-3 text-sm font-medium">
                        {itemDate.format("DD MMMM YYYY")}
                      </p>
                    )}
                    <Transaction
                      data={item}
                      showDetail={(transaction) => setShownDetail(transaction)}
                    />
                  </div>
                );
              })}

            {hasNextPage && (
              <Button
                className="mx-auto"
                isLoading={isFetchingNextPage}
                variant="flat"
                onPress={() => fetchNextPage()}
              >
                Lebih Banyak
              </Button>
            )}
          </div>
        </div>
      </main>
      <DetailModal
        data={shownDetail}
        deleteTransaction={deleteTransaction}
        onClose={() => setShownDetail(null)}
      />
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Cash;
