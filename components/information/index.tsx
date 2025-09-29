"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { Card } from "@heroui/card";

import { usePopup } from "../popup-provider";
import Navbar from "../navbar";

import DetailModal from "./detail";
import NewModal from "./new";

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
      icon: <FaTrash className="text-danger" size={75} />,
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
            {data?.pages
              .flatMap((page) => page.data)
              .map((info: InformationT) => (
                <Card
                  key={"info-" + info.id}
                  isPressable
                  className=""
                  radius="sm"
                  shadow="sm"
                  onPress={() => setShownInfo(info)}
                >
                  <div className="flex px-4 py-3 w-full justify-between items-center">
                    <p className="line-clamp-1 text-center w-full">
                      {info.title}
                    </p>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <img
                      alt={info.title}
                      className="w-full h-full hover:scale-105 duration-200 object-cover"
                      loading="lazy"
                      src={info.images[0]}
                    />
                  </div>
                </Card>
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
