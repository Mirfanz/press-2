"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { addToast, Divider, Form, NumberInput } from "@heroui/react";
import axios from "axios";
import React, { FormEvent, useState } from "react";
import { FaBug, FaCircleQuestion } from "react-icons/fa6";

import { usePopup } from "../popup-provider";

import queryClient from "@/lib/utils/query-client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

const AddModal = ({ isOpen, onClose, onError, onSuccess }: Props) => {
  const popup = usePopup();
  const [isIncome, setIsIncome] = useState(true);
  const [loading, setLoading] = useState(false);
  const [field, setFields] = useState({
    title: "",
    amount: 0,
    note: "",
  });

  const handleFieldChange = (field: string, value: string | number) => {
    if (loading) return;
    setFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const ok = await popup.show({
      title: "Simpan " + (isIncome ? "Pendapatan" : "Pengeluaran"),
      description: "Anda dapat menghapusnya lagi nanti",
      icon: <FaCircleQuestion className="w-20 h-20 text-primary" />,
      confirmButton: "Simpan",
      cancelButton: "Batal",
      confirmColor: "primary",
    });

    if (!ok) return;
    setLoading(true);
    axios
      .post("/api/finance/transaction", {
        income: isIncome,
        title: field.title,
        amount: field.amount,
        note: field.note,
        images: [],
      })
      .then((res) => {
        addToast({
          title:
            (res.data.data.income ? "Pemasukan" : "Pengeluaran") +
            " Ditambahkan",
          description: res.data.data.title,
        });
        setFields({ title: "", amount: 0, note: "" });
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        queryClient.invalidateQueries({ queryKey: ["balance"] });

        onClose();
        onSuccess?.();
      })
      .catch((error) => {
        popup.show({
          title: "Terjadi Kesalahan",
          description: error.response?.data?.message,
          icon: <FaBug className="w-20 h-20 text-danger" />,
          cancelButton: "Oke",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen}>
      <Form
        className="space-y-4"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <ModalContent>
          <ModalHeader className="text-center justify-center">
            Buat Transaksi Baru
          </ModalHeader>
          <Divider className="mb-4" />
          <ModalBody className="gap-4">
            <div className="flex gap-2">
              <Button
                className="flex-1"
                color="primary"
                variant={isIncome ? "solid" : "faded"}
                onPress={() => setIsIncome(true)}
              >
                Pemasukan
              </Button>
              <Button
                className="flex-1"
                color="primary"
                variant={!isIncome ? "solid" : "faded"}
                onPress={() => setIsIncome(false)}
              >
                Pengeluaran
              </Button>
            </div>
            <Input
              isRequired
              className=""
              color="primary"
              label="Keterangan"
              minLength={5}
              name="title"
              placeholder={
                isIncome ? "Pemasukan dari mana?" : "Pengeluaran untuk apa?"
              }
              validate={(value) => {
                return true;
              }}
              value={field.title}
              variant="faded"
              onValueChange={(value) => handleFieldChange("title", value)}
            />
            <NumberInput
              hideStepper
              isRequired
              classNames={{ input: "", mainWrapper: "w-36 ms-auto" }}
              color="primary"
              label="Nominal"
              labelPlacement="outside-left"
              name="amount"
              placeholder="Min. 1000"
              startContent={
                <span className="text-base text-foreground-700">Rp</span>
              }
              validate={(value) => {
                if (value < 1000) return "Minimal 1000";

                return true;
              }}
              value={field.amount}
              variant="faded"
              onValueChange={(value) => handleFieldChange("amount", value)}
            />
            <Textarea
              className=""
              color="primary"
              label="Catatan"
              name="note"
              placeholder="Catatan tambahan (opsional)"
              validate={(value) => {
                return true;
              }}
              value={field.note}
              variant="faded"
              onValueChange={(value) => handleFieldChange("note", value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Batal</Button>
            <Button color="primary" isLoading={loading} type="submit">
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default AddModal;
