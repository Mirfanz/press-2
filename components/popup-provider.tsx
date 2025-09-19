"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal, ModalContent, Button } from "@heroui/react";

type PopupOptions = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  confirmButton?: string;
  cancelButton?: string;
  confirmColor?: "primary" | "danger";
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
            {options.icon}
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
