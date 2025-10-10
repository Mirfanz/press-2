"use client";

import React from "react";
import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { Spinner } from "@heroui/spinner";

import Navbar from "../navbar";
import { UserCheckBoldIcon, UserCrossBoldIcon } from "../icons";

import { TaxT } from "@/types";
import dayjs from "@/lib/utils/dayjs";
import queryClient from "@/lib/utils/query-client";

type Props = {};

const Tax = (props: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      {
        queryKey: ["taxes"],
        queryFn: async ({ pageParam = 1 }) => {
          const res = await axios.get(`/api/finance/tax?page=${pageParam}`);

          console.log("res", res);

          return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.meta.page < lastPage.meta.totalPages) {
            return lastPage.meta.page + 1;
          } else {
            return undefined;
          }
        },
      },
      queryClient,
    );

  return (
    <div>
      <Navbar title="KAS BULANAN" />
      <main className="container py-4">
        <div className="flex flex-col gap-4">
          {isLoading && <Spinner />}
          {data?.pages
            .flatMap((page) => page.data)
            .map((tax: TaxT) => (
              <Card key={tax.id} className="p-4 shadow-lg" shadow="none">
                <h3 className="text-center mb-3 uppercase text-primary font-bold">
                  {dayjs(`${tax.year}-${tax.month}-01`).format("MMMM YYYY")}
                </h3>
                <div className="flex gap-4">
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <p className="text-xs text-foreground-600">Total Dana</p>
                    <p className="text-lg font-medium text-foreground-800">
                      Rp {(tax.amount * tax.paid_count).toLocaleString()}
                    </p>
                  </div>
                  <Divider className="mx-0 h-auto" orientation="vertical" />
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex text-xs items-end">
                      <UserCheckBoldIcon
                        className="text-success-600"
                        size={18}
                      />
                      <p className="ms-1">{tax.paid_count} Orang</p>
                    </div>
                    <div className="flex text-xs items-end">
                      <UserCrossBoldIcon className="text-danger" size={18} />
                      <p className="ms-1">{tax.unpaid_count} Orang</p>
                    </div>
                    <Button
                      as={Link}
                      className="mt-1"
                      color="default"
                      href={`/cash/tax/${tax.id}`}
                      size="sm"
                      variant="flat"
                    >
                      Lihat Detail
                    </Button>
                  </div>
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
              Lebih Banyak
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tax;
