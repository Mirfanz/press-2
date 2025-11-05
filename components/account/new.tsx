"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Role } from "@prisma/client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { addToast } from "@heroui/toast";

import { usePopup } from "../popup-provider";
import { CloseSquareIcon, QuestionCircleIcon } from "../icons";

import queryClient from "@/lib/utils/query-client";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

const NewUserModal = ({ isOpen, onClose }: Props) => {
  const [fields, setFields] = useState<{
    name: string;
    nik: string;
    role: Role;
  }>({
    name: "",
    nik: "",
    role: Role.Operator,
  });
  const [uploading, setUploading] = useState(false);
  const popup = usePopup();

  const close = () => {
    setFields({
      name: "",
      nik: "",
      role: Role.Operator,
    });
    onClose();
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;
    const { name, value } = e.currentTarget;

    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uploading) return;
    const ok = await popup.show({
      icon: QuestionCircleIcon,
      title: `Tambah ${fields.role}?`,
      description: "Pastikan data yang anda masukan sudah benar",
      confirmButton: "Upload",
      cancelButton: "Batal",
    });

    if (!ok) return;

    setUploading(true);
    axios
      .post("/api/user", {
        name: fields.name,
        nik: fields.nik,
        role: fields.role,
      })
      .then((res) => {
        addToast({ title: "Anggota Ditambahkan", color: "success" });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        close();
      })
      .catch((error) => {
        popup.show({
          title: "Gagal Menambahkan",
          icon: CloseSquareIcon,
          iconColor: "danger",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Terjadi kesalahan saat menambah anggota.",
          confirmButton: "Tutup",
        });
      })
      .finally(() => setUploading(false));
  };

  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen}>
      <Form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="text-center justify-center">
            Tambah {fields.role}
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              isRequired
              color="primary"
              label="Nama Lengkap"
              name="name"
              placeholder="Prabowo Subianto"
              value={fields.name}
              variant="faded"
              onChange={handleFieldChange}
            />
            <Input
              isRequired
              color="primary"
              label="NIK"
              name="nik"
              placeholder="FP0123"
              value={fields.nik}
              variant="faded"
              onChange={handleFieldChange}
            />
            <Select
              isRequired
              classNames={{ mainWrapper: "w-36 ms-auto" }}
              color="primary"
              items={[
                { key: Role.Leader, label: Role.Leader },
                { key: Role.Subleader, label: Role.Subleader },
                { key: Role.Bendahara, label: Role.Bendahara },
                { key: Role.Operator, label: Role.Operator },
              ]}
              label="Role / Posisi"
              labelPlacement="outside-left"
              name="role"
              placeholder="Pilih Role"
              selectedKeys={[fields.role]}
              variant="faded"
              onSelectionChange={(keys) => {
                if (uploading) return;
                setFields((prev) => ({
                  ...prev,
                  role: keys.currentKey as Role,
                }));
              }}
            >
              {(data) => <SelectItem key={data.key}>{data.label}</SelectItem>}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onPress={close}>Batal</Button>
            <Button color="primary" isLoading={uploading} type="submit">
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default NewUserModal;
