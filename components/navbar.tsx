"use client";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

import { ArrowLeftIcon } from "./icons";

type Props = {
  title: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  hidePrevButton?: boolean;
};

const Navbar = ({ startContent, title, endContent, hidePrevButton }: Props) => {
  const router = useRouter();

  return (
    <nav className="bg-primary py-3 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="w-full justify-start flex gap-1.5 items-center">
            {!hidePrevButton && (
              <Button
                isIconOnly
                className="text-primary-foreground"
                size="sm"
                variant="light"
                onPress={router.back}
              >
                <ArrowLeftIcon />
              </Button>
            )}
            {startContent}
          </div>
          <div>
            <p className="text-primary-foreground font-semibold w-max">
              {title}
            </p>
          </div>
          <div className="w-full justify-end flex gap-1.5 items-center">
            {endContent}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
