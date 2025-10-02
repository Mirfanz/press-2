"use client";

import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/modal";
import React, { useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination, Virtual } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";

import { TrashIcon } from "../icons";

import dayjs from "@/lib/utils/dayjs";
import { InformationT } from "@/types";

type Props = {
  data: InformationT | null;
  onClose: () => void;
  deleteInformation: (info: InformationT) => Promise<boolean>;
};

const DetailModal = ({ data, onClose, deleteInformation }: Props) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteInfo = () => {
    if (!data) return;
    if (deleting) return;
    setDeleting(true);
    deleteInformation(data)
      .then((res) => {
        if (res) onClose();
      })
      .finally(() => setDeleting(false));
  };

  return (
    <>
      <Modal hideCloseButton isDismissable={false} isOpen={!!data}>
        <ModalContent>
          <ModalBody>
            <h3 className="text-lg text-center font-medium mt-3 mb-2">
              {data?.title}
            </h3>
            <div className="w-full relative">
              <Swiper
                virtual
                className="w-full aspect-videos"
                modules={[Virtual, Pagination]}
                pagination={{ el: ".navigation" }}
                slidesPerView={1}
              >
                {data?.images.map((img, index) => (
                  <SwiperSlide key={img} onClick={() => setOpen(true)}>
                    <button>
                      <img
                        alt={"image " + index}
                        className="w-full aspect-video rounded-xl object-cover border-1 border-solid border-foreground-300"
                        loading="lazy"
                        src={img}
                      />
                    </button>
                  </SwiperSlide>
                ))}
                <div className="navigation" />
              </Swiper>
            </div>
            <div className="rounded-2xl px-3 py-2 bg-foreground-100">
              <p className="text-sm mb-1 font-medium">Catatan :</p>
              <p className="text-sm text-foreground-600 whitespace-pre-wrap">
                {data?.note || <i>Tidak ada catatan</i>}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <p className="text-sm text-foreground-600 m-auto ms-0 whitespace-pre-wrap">
              {dayjs(data?.created_at).format("dddd, DD\nMMMM YYYY")}
            </p>
            <Button
              isIconOnly
              color="danger"
              isLoading={deleting}
              variant="flat"
              onPress={handleDeleteInfo}
            >
              <TrashIcon />
            </Button>
            <Button onPress={onClose}>Tutup</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Lightbox
        close={() => setOpen(false)}
        open={open}
        plugins={[Zoom, Counter]}
        slides={data?.images.map((img) => ({ src: img }))}
      />
    </>
  );
};

export default DetailModal;
