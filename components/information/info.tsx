"use client";

import { Card } from "@heroui/card";
import React from "react";

import { InformationT } from "@/types";

type Props = {
  showDetail: () => void;
  data: InformationT;
};

const Info = ({ showDetail, data }: Props) => {
  return (
    <Card
      isPressable
      className=""
      radius="sm"
      shadow="sm"
      onPress={() => showDetail()}
    >
      <div className="flex px-4 py-3 w-full justify-between items-center">
        <p className="line-clamp-1 text-center w-full">{data.title}</p>
      </div>
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <img
          alt={data.title}
          className="w-full h-full hover:scale-105 duration-200 object-cover"
          loading="lazy"
          src={data.images[0]}
        />
      </div>
    </Card>
  );
};

export default Info;
