"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/modal";
import React from "react";
import { FaTrash } from "react-icons/fa6";

import { useAuth } from "../auth-provider";

import dayjs from "@/lib/utils/dayjs";
import { TransactionT } from "@/types";

type Props = {
  data: TransactionT | null;
  onClose: () => void;
  deleteTransaction: (id: string) => void;
};

const DetailModal = ({ data, onClose, deleteTransaction }: Props) => {
  const auth = useAuth();

  if (data === null) return null;

  return (
    <Modal hideCloseButton isDismissable isOpen={!!data} onClose={onClose}>
      <ModalContent>
        <ModalBody className="p-4 pb-2">
          <h3 className="text-lg my-1">{data?.title}</h3>
          <div className="flex justify-between items-center mb-3">
            <Chip
              className="mt-2"
              color={data?.income ? "success" : "danger"}
              variant="flat"
            >
              {data?.income ? "Pemasukan" : "Pengeluaran"}
            </Chip>
            <p className="font-medium text-2xl mt-2">
              {data?.income ? "+" : "-"}
              {data?.amount.toLocaleString()}
            </p>
          </div>
          <div className="bg-foreground-100 rounded-lg p-4">
            <p className="mb-1">Catatan:</p>
            <p className="text-sm whitespace-pre-wrap">
              {data?.note || <i>Tidak ada catatan</i>}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <p className="m-auto ms-0 text-sm">
            {dayjs(data?.created_at || "2002-10-20").format(
              "dddd, DD MMM YYYY",
            )}
          </p>
          {auth.hasRole("Admin", "Bendahara") && (
            <Button
              isIconOnly
              color="danger"
              variant="flat"
              onPress={() => deleteTransaction(data.id)}
            >
              <FaTrash className="text-base" />
            </Button>
          )}
          <Button onPress={onClose}>Tutup</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailModal;
