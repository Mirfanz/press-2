"use client";

import React from "react";
import { Avatar, Button, Card, Chip, Divider } from "@heroui/react";
import { FaGear } from "react-icons/fa6";
import Link from "next/link";

type Props = {};

const Home = (props: Props) => {
  return (
    <main>
      <div className="flex px-5 py-6 gap-4 items-center">
        <Avatar isBordered size="md" />
        <div className="">
          <h3 className="text-sm font-medium -mb-1 text-foreground-800">
            Muhammad Irfan
          </h3>
          <small className="text-xs text-foreground-500">
            FO0306 | Operator
          </small>
        </div>
        <Button isIconOnly className="ml-auto" color="primary" variant="solid">
          <FaGear className="text-lg" />
        </Button>
      </div>
      <div className="container">
        <div className="p-6 rounded-2xl flex bg-primary text-primary-foreground shadow-primary-500 shadow-lg flex-row gap-5">
          <div className="flex items-center flex-col gap-1">
            <p className="text-sm text-foreground-300">Member</p>
            <p className="text-2xl font-medium">42</p>
          </div>
          <div className="flex flex-col gap-1 border-l ps-5 border-foreground-400">
            <p className="text-sm text-foreground-300">Saldo Kas :</p>
            <p className="text-2xl font-medium">Rp 570.000</p>
          </div>
        </div>
      </div>
      <div className="container my-6">
        <div className="flex items-center justify-between mb-1">
          <h3>Laporan Keuangan</h3>
          <Button as={Link} href="/cash" size="sm" variant="light">
            Lihat Lainnya
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((item) => (
            <div
              key={"report-" + item}
              className="justify-between flex bg-white rounded-2xl items-center flex-row p-4"
            >
              <p className="text-sm line-clamp-1 text-foreground-500">
                Lorem ipsum dolor sit amet.
              </p>
              <p className="text-success-600 font-medium">+24.000</p>
            </div>
          ))}
        </div>
      </div>
      <div className="container my-6">
        <div className="flex flex-col gap-4">
          <Card className="w-full p-6 pt-4">
            <h5 className="text-center font-bold text-primary">Line 1</h5>
            <Divider className="mt-3 mb-4" />
            <div className="">
              <div className="flex text-sm text-foreground-500 justify-between">
                <p className="mb-1">Bucket Loader</p>
                <p className="">FILL</p>
              </div>
              <div className="flex text-sm text-foreground-500 justify-between">
                <p className="">Emergency</p>
                <p className="text-danger">ON</p>
              </div>
            </div>
          </Card>
          <Card className="w-full p-6 pt-4">
            <h5 className="text-center font-bold text-primary">Line 2</h5>
            <Divider className="mt-3 mb-4" />
            <div className="">
              <div className="flex text-sm text-foreground-500 justify-between">
                <p className="mb-1">Bucket Loader</p>
                <p className="text-danger">EMPTY</p>
              </div>
              <div className="flex text-sm text-foreground-500 justify-between">
                <p className="">Emergency</p>
                <p className="">OFF</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="container my-6">
        <Card className="p-4">
          <h5 className="text-center font-bold text-primary">
            Happy Birthday🎉
          </h5>
          <Divider className="my-3" />
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground-500">
              Selamat ulang tahun, semoga tidak lupa makan-makan-nya, thankyuuu
              &gt;_&lt;
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Chip className="" size="sm">
                Muhammad Irfan
              </Chip>
              <Chip className="" size="sm">
                Adinda Oktasari
              </Chip>
              <Chip className="" size="sm">
                Arsyanendra Alfatih
              </Chip>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Home;
