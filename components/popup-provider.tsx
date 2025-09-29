"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
} from "react";
import { Modal, ModalContent, Button } from "@heroui/react";
import clsx from "clsx";

import { IconSvgProps } from "@/types";

type Colors =
  | "primary"
  | "warning"
  | "danger"
  | "default"
  | "secondary"
  | "success";

type PopupOptions = {
  icon?: FC<IconSvgProps>;
  title?: string;
  description?: string;
  confirmButton?: string;
  cancelButton?: string;
  confirmColor?: Colors;
  iconColor?: Colors;
};

type PopupContextType = {
  show: (options: PopupOptions) => Promise<boolean>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);

  if (!context) throw new Error("usePopup must be used within PopupProvider");

  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({});
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  const showPopup = (options: PopupOptions) => {
    setOptions(options);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleConfirm = () => {
    resolver?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver?.(false);
    setIsOpen(false);
  };

  return (
    <PopupContext.Provider value={{ show: showPopup }}>
      {children}
      <Modal
        hideCloseButton
        isDismissable={true}
        isOpen={isOpen}
        placement="center"
        size="xs"
        onClose={handleCancel}
      >
        <ModalContent>
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            {!!options.icon && (
              <options.icon
                className={clsx(
                  "w-22 h-22 mt-3 mb-1",
                  `text-${options.iconColor || "primary"}`,
                )}
              />
            )}
            <p className="text-xl font-semibold text-foreground-700">
              {options.title}
            </p>
            {!!options.description && (
              <p className="text-base text-foreground-600 text-center">
                {options.description}
              </p>
            )}
            <div className="flex justify-center gap-3">
              {!!options.cancelButton && (
                <Button className="my-2" onPress={handleCancel}>
                  {options.cancelButton}
                </Button>
              )}
              {!!options.confirmButton && (
                <Button
                  className="my-2"
                  color={options.confirmColor || "primary"}
                  onPress={handleConfirm}
                >
                  {options.confirmButton}
                </Button>
              )}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </PopupContext.Provider>
  );
};
