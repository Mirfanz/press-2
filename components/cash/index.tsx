"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";

import Navbar from "../navbar";
import { HandMoneyIcon } from "../icons";

import Transaction from "./transaction";
import AddModal from "./add-modal";
import DetailModal from "./detail-modal";

import queryClient from "@/lib/utils/query-client";
import { TransactionT } from "@/types";
import dayjs from "@/lib/utils/dayjs";

type Props = {};

let lastdate = dayjs();

const Cash = (props: Props) => {
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
    try {
      await axios.delete(`/api/finance/transaction`, {
        data: { id },
      });
      setShownDetail(null);
      alert("Transaksi dihapus");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } catch (error) {
      alert("Gagal menghapus transaksi");
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div>
      <div className="sticky top-0">
        <Navbar
          endContent={
            <>
              <Button
                isIconOnly
                className="text-foreground-100"
                size="sm"
                variant="light"
                onPress={() => setIsAddModalOpen(true)}
              >
                <FaPlus size={18} />
              </Button>
              <Button isIconOnly className="" size="sm">
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
              .map((item: TransactionT) => {
                const itemDate = dayjs(item.created_at);
                const changeDate = !itemDate.isSame(lastdate, "date");

                if (changeDate) lastdate = itemDate;

                return (
                  <>
                    {changeDate && (
                      <p className="text-center text-sm font-medium mt-2">
                        {itemDate.format("DD MMMM YYYY")}
                      </p>
                    )}
                    <Transaction
                      data={item}
                      showDetail={(transaction) => setShownDetail(transaction)}
                    />
                  </>
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
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default Cash;
