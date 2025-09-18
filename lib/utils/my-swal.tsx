"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const mySwal = withReactContent(
  Swal.mixin({
    showConfirmButton: false,
    customClass: {
      container: clsx("bg-red-500"),
      popup: clsx("bg-red-500"),
    },
  }),
);

import React, { ReactNode } from "react";
import { Button } from "@heroui/button";
import clsx from "clsx";

type Props = {
  title: string | ReactNode;
  description?: string | ReactNode;
  confirmButton?: string;
  cancelButton?: string;
  denyButton?: string;
  icon?: ReactNode;
};

const SwalContent = ({
  icon,
  title,
  description,
  confirmButton,
  cancelButton,
  denyButton,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {icon}
      <p className="text-2xl font-semibold text-foreground-700">{title}</p>
      {!!description && (
        <p className="text-base text-foreground-600 font-normal">
          {description}
        </p>
      )}
      <div className="flex justify-center gap-3">
        {!!cancelButton && (
          <Button className="my-2" onPress={mySwal.clickDeny}>
            {cancelButton}
          </Button>
        )}
        {!!denyButton && (
          <Button className="my-2" color="danger" onPress={mySwal.clickCancel}>
            {denyButton}
          </Button>
        )}
        {!!confirmButton && (
          <Button
            className="my-2"
            color="primary"
            onPress={mySwal.clickConfirm}
          >
            {confirmButton}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SwalContent;
