"use client";

import React from "react";
import { Button } from "@heroui/button";

import Navbar from "../navbar";
import { HandMoney } from "../icons";

type Props = {};

const Cash = (props: Props) => {
  return (
    <div>
      <div className="sticky top-0">
        <Navbar
          endContent={
            <Button isIconOnly className="" size="sm">
              <HandMoney />
            </Button>
          }
          title="KEUANGAN"
        />
        <div className="relative">
          <div className="absolute block bg-primary h-14 w-full rounded-b-xl" />
          <div className="bg-white flex flex-col gap-1.5 justify-center items-center mx-6 relative h-24 rounded-2xl border-2 border-primary">
            <p className="text-sm text-foreground-500">Sisa Saldo :</p>
            <p className="font-bold text-3xl text-primary">Rp 2.570.000</p>
          </div>
        </div>
      </div>
      <main>
        <div className="container my-4">
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm font-medium">21 September 2025</p>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13].map((item) => (
              <div
                key={"transaction-" + item}
                className="flex justify-between items-center bg-white px-4 py-3 rounded-lg"
              >
                <p className="text-sm text-foreground-800 line-clamp-1">
                  Lorem ipsum dolor sit.
                </p>
                <p className="text-danger font-medium">-230.000</p>
              </div>
            ))}
            {/* <i className="mx-auto text-sm">Tidak Ada Lagi</i> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cash;
