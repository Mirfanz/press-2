"use client";

import clsx from "clsx";
import React from "react";
import { Card } from "@heroui/card";

import { TransactionT } from "@/types";

type Props = {
  data: TransactionT;
  showDetail?: (transaction: TransactionT) => void;
};

const Transaction = ({ data, showDetail }: Props) => {
  return (
    <Card
      fullWidth
      isPressable
      className="flex-row justify-between items-center px-4 py-3"
      radius="sm"
      shadow="sm"
      onPress={() => showDetail?.(data)}
    >
      <p className="text-sm text-start text-foreground-800 line-clamp-1">
        {data.title}
      </p>
      <p
        className={clsx(
          "font-medium",
          data.income ? "text-success-600" : "text-danger",
        )}
      >
        {data.income ? "+" : "-"}
        {data.amount.toLocaleString()}
      </p>
    </Card>
  );
};

export default Transaction;
