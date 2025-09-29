"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  FaBugs,
  FaFileImage,
  FaPaperPlane,
  FaTrash,
  FaTrashCan,
} from "react-icons/fa6";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Virtual } from "swiper/modules";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { v4 } from "uuid";

import { usePopup } from "../popup-provider";

import queryClient from "@/lib/utils/query-client";
import { supabase } from "@/lib/utils/supabase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

const NewModal = ({ isOpen, onClose, onSuccess, onError }: Props) => {
  const [fields, setFields] = useState({
    title: "",
    note: "",
  });
  const popup = usePopup();
  const swiper = useSwiper();
  const [images, setImages] = useState<{ file: File; preview_url: string }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  const inpFileRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setFields({ title: "", note: "" });
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview_url);
    });
    setImages([]);
    onClose();
  };

  const handleAddImage = () => {
    if (images.length > 2 || isLoading) return;
    inpFileRef.current?.click();
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (images.length > 2) {
      e.target.value = "";

      return;
    }
    const image = e.target.files?.[0];

    console.log("image", image);
    if (!image) return;
    const newImages = [...images];
    const preview_url = URL.createObjectURL(image);

    newImages.push({ file: image, preview_url: preview_url });
    setImages(newImages);
    e.target.value = "";
  };
  const handleDeleteImage = async (url: string) => {
    if (isLoading) return;
    const ok = await popup.show({
      title: "Hapus Foto?",
      icon: <FaTrashCan className="text-danger" size={50} />,
      description: "Apakah anda yakin ingin menghapus foto",
      confirmButton: "Hapus",
      confirmColor: "danger",
      cancelButton: "Batal",
    });

    if (!ok) return;
    const newImages = images.filter((item) => item.preview_url != url);

    URL.revokeObjectURL(url);
    setImages(newImages);
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return;
    const { name, value } = e.currentTarget;

    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const ok = await popup.show({
      icon: <FaPaperPlane className="text-primary" size={50} />,
      title: "Upload Informasi?",
      description: "Pastikan data yang anda masukan sudah benar",
      confirmButton: "Upload",
      cancelButton: "Batal",
    });

    if (!ok) return;
    setIsLoading(true);
    const uploadedImages: string[] = [];

    for (const img of images) {
      const name = `${v4()}.${img.file.name.split(".").pop()}`;
      const { data } = await supabase.storage
        .from("information")
        .upload(name, img.file);

      if (!data) continue;
      uploadedImages.push(
        supabase.storage.from("information").getPublicUrl(name).data.publicUrl,
      );
    }

    axios
      .post("/api/information", {
        title: fields.title,
        note: fields.note,
        images: uploadedImages,
      })
      .then((res) => {
        addToast({ title: "Informasi Ditambahkan", color: "success" });
        queryClient.invalidateQueries({ queryKey: ["information"] });
        handleClose();
      })
      .catch((error) => {
        popup.show({
          title: "Upload Gagal",
          icon: <FaBugs className="text-danger" size={50} />,
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Terjadi kesalahan saat menambah informasi.",
          confirmButton: "Tutup",
          //   confirmColor: "danger",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen}>
      <Form validationBehavior="native" onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="text-center justify-center">
            Informasi Baru
          </ModalHeader>
          <Divider />
          <ModalBody>
            <Swiper
              virtual
              className="w-full aspect-video mt-3"
              modules={[Virtual, Pagination]}
              pagination={{ el: ".pagi" }}
              slidesPerView={1}
              spaceBetween={10}
            >
              {images.map((item, index) => (
                <SwiperSlide key={item.file.name} virtualIndex={index}>
                  <div className="relative w-full overflow-hidden bg-foreground-100 rounded-2xl aspect-video">
                    <img
                      alt={item.file.name}
                      className="w-full h-full object-cover object-center"
                      src={item.preview_url}
                    />
                    <Button
                      isIconOnly
                      className="top-3 right-3 absolute"
                      color="danger"
                      variant="flat"
                      onPress={() => handleDeleteImage(item.preview_url)}
                    >
                      <FaTrash className="text-base" />
                    </Button>
                  </div>
                </SwiperSlide>
              ))}
              {images.length < 3 && (
                <SwiperSlide virtualIndex={999}>
                  <div className="w-full aspect-video text-primary border-1.5 border-dashed border-primary flex justify-center items-center gap-3 rounded-2xl">
                    <button
                      className="flex flex-col justify-center items-center gap-3"
                      type="button"
                      onClick={handleAddImage}
                    >
                      <FaFileImage size={40} />
                      <p>Add Image</p>
                    </button>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
            <div className="pagi justify-center flex my-0" />
            <input
              ref={inpFileRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleImageChange}
            />
            <Input
              isRequired
              className="mt-2"
              color="primary"
              label="Title"
              minLength={3}
              name="title"
              placeholder="Judul Informasi"
              value={fields.title}
              variant="bordered"
              onChange={handleFieldChange}
            />
            <Textarea
              color="primary"
              label="Catatan"
              name="note"
              placeholder="Tambahkan catatan bila perlu"
              value={fields.note}
              variant="bordered"
              onChange={handleFieldChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleClose}>Batal</Button>
            <Button color="primary" isLoading={isLoading} type="submit">
              Tambah
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};

export default NewModal;
