"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa6";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";

import { usePopup } from "../popup-provider";
import Navbar from "../navbar";
import { TrashIcon } from "../icons";

import DetailModal from "./detail";
import NewModal from "./new";
import Info from "./info";

import { InformationT } from "@/types";
import queryClient from "@/lib/utils/query-client";

type Props = {};

const Information = (props: Props) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [shownInfo, setShownInfo] = useState<InformationT | null>(null);
  const popup = usePopup();

  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    {
      queryKey: ["information"],
      queryFn: async ({ pageParam }) => {
        const res = await axios.get("/api/information", {
          params: { page: pageParam },
        });

        console.log("res", res);

        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (page) => {
        if (page.meta.totalPages > page.meta.page) return page.meta.page + 1;

        return undefined;
      },
    },
    queryClient,
  );

  const deleteInformation = async (information: InformationT) => {
    const ok = await popup.show({
      icon: TrashIcon,
      iconColor: "danger",
      title: "Hapus Info?",
      description: "Informasi ini akan dihapus dan tidak dapat di pulihkan",
      cancelButton: "Batalkan",
      confirmButton: "Ya, Hapus",
      confirmColor: "danger",
    });

    if (!ok) return false;
    const result: boolean = await axios
      .delete("/api/information", { data: { information_id: information.id } })
      .then((res) => {
        addToast({ title: "Informasi Dihapus" });
        queryClient.invalidateQueries({ queryKey: ["information"] });

        return true;
      })
      .catch((error) => {
        addToast({ title: "Gagal Dihapus", color: "danger" });

        return false;
      });

    return result;
  };

  return (
    <div>
      <Navbar
        endContent={
          <Button
            isIconOnly
            className="text-primary-foreground"
            size="sm"
            variant="bordered"
            onPress={() => setAddModalOpen(true)}
          >
            <FaPlus size={18} />
          </Button>
        }
        title="INFORMATION"
      />
      <main className="py-4">
        <div className="container">
          <div className="flex flex-col gap-5">
            {isLoading && <Spinner />}
            {data?.pages
              .flatMap((page) => page.data)
              .map((info: InformationT) => (
                <Info
                  key={info.id}
                  data={info}
                  showDetail={() => setShownInfo(info)}
                />
              ))}
            {hasNextPage && (
              <Button variant="flat" onPress={() => fetchNextPage()}>
                Show More
              </Button>
            )}
          </div>
        </div>
      </main>
      <DetailModal
        data={shownInfo}
        deleteInformation={deleteInformation}
        onClose={() => setShownInfo(null)}
      />
      <NewModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
};

export default Information;
