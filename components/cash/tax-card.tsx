"use client";

import { Card } from "@heroui/card";
import Link from "next/link";
import React from "react";
import { Divider } from "@heroui/divider";

import dayjs from "@/lib/utils/dayjs";
import { TaxT } from "@/types";

type Props = {
  tax: TaxT;
};

const TaxCard = ({ tax }: Props) => {
  return (
    <Card
      isPressable
      as={Link}
      className="p-4 shadow-lg"
      href={`/cash/tax/${tax.id}`}
      shadow="none"
    >
      <h3 className="text-center mb-3 uppercase text-primary font-bold">
        {dayjs(`${tax.year}-${tax.month}-01`).format("MMMM YYYY")}
      </h3>
      <div className="flex gap-4">
        <div className="flex w-full flex-col items-center justify-center gap-1">
          <p className="text-xs text-foreground-600">Terkumpul :</p>
          <p className="text-lg font-medium text-foreground-800">
            Rp {(tax.amount * tax.paid_count).toLocaleString()}
          </p>
        </div>
        <Divider className="mx-0 h-auto" orientation="vertical" />
        <div className="flex w-full items-center justify-evenly gap-2">
          <div className="text-center text-success">
            <p className="text-sm  font-semibold">{tax.paid_count}</p>
            <p className="text-xs">Sudah</p>
          </div>
          <div className="text-center text-danger">
            <p className="text-sm font-semibold">{tax.unpaid_count}</p>
            <p className="text-xs">Belum</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaxCard;
