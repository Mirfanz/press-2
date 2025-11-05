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
import React, { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { CheckReadIcon, CloseSquareIcon, QuestionCircleIcon } from "../icons";
import { usePopup } from "../popup-provider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
};

const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const [fields, setFields] = useState({
    password: "",
    new_password: "",
    repeat_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const popup = usePopup();
  const router = useRouter();

  const close = () => {
    setFields({ password: "", new_password: "", repeat_password: "" });
    onClose();
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const { name, value } = e.currentTarget;

    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ok = await popup.show({
      icon: QuestionCircleIcon,
      title: "Ganti Password?",
      description: "Anda yakin ingin mengganti password. Jangan sampai lupa",
      confirmButton: "Ya, Ganti",
      cancelButton: "Batal",
    });

    if (!ok) return;
    setIsLoading(true);
    axios
      .patch("/api/auth/change-password", {
        password: fields.password,
        new_password: fields.new_password,
      })
      .then((res) => {
        console.log("res", res);
        addToast({ title: "Password Diubah", color: "success" });
        popup.show({
          title: "Password Diubah",
          icon: CheckReadIcon,
          iconColor: "success",
          description: "Password anda telah diubah. Silahkan login kembali",
          confirmButton: "Tutup",
        });
        router.refresh();
        close();
      })
      .catch((error) => {
        popup.show({
          title: "Gagal",
          icon: CloseSquareIcon,
          iconColor: "danger",
          description:
            error?.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan saat mengganti password.",
          confirmButton: "Tutup",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen}>
      <Form autoComplete="off" onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="justify-center text-center">
            Ganti Password
          </ModalHeader>
          <ModalBody className="">
            <Input
              isRequired
              className="mb-2"
              classNames={{ helperWrapper: "-mb-1" }}
              color="primary"
              label="Password"
              minLength={8}
              name="password"
              placeholder="Password saat ini"
              type="password"
              value={fields.password}
              variant="faded"
              onChange={handleFieldChange}
            />
            <Input
              isRequired
              classNames={{ helperWrapper: "-mb-1" }}
              color="primary"
              label="New Password"
              minLength={8}
              name="new_password"
              placeholder="Password baru"
              type="password"
              validate={(val) => {
                if (val === fields.password)
                  return "Masa password nya gak berubah?";

                return true;
              }}
              value={fields.new_password}
              variant="faded"
              onChange={handleFieldChange}
            />
            <Input
              isRequired
              classNames={{ helperWrapper: "-mb-1" }}
              color="primary"
              labelPlacement="inside"
              minLength={8}
              name="repeat_password"
              placeholder="Ulangi password"
              type="password"
              validate={(val) => {
                if (val != fields.new_password) return "Password tidak sama";

                return true;
              }}
              value={fields.repeat_password}
              variant="faded"
              onChange={handleFieldChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={close}>Batal</Button>
            <Button color="primary" isLoading={isLoading} type="submit">
              Ganti Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
