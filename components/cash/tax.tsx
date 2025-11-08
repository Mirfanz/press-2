"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Spinner } from "@heroui/spinner";

import Navbar from "../navbar";

import TaxCard from "./tax-card";

import { TaxT } from "@/types";
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
            .map((tax: TaxT) => <TaxCard key={tax.id} tax={tax} />)}
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
