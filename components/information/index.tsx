"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";

import Navbar from "../navbar";

type Props = {};

const Information = (props: Props) => {
  return (
    <div>
      <Navbar
        endContent={
          <>
            {/* <Button size="sm" isIconOnly>
              D
            </Button> */}
          </>
        }
        title="INFORMATION"
      />
      <main className="py-4">
        <div className="container">
          <div className="flex flex-col gap-5">
            {[1, 2, 3, 5, 6, 7, 8, 9].map((item) => (
              <div key={"info-" + item} className="">
                <div className="flex mb-2 justify-between items-center">
                  <p className="line-clamp-1">
                    Judul Informasi Judul Informasi Disini Yaa
                  </p>
                  <Button size="sm">Lihat</Button>
                </div>
                <Skeleton className="w-full aspect-video rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Information;
