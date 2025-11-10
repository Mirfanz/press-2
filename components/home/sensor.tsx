"use client";

import { Card } from "@heroui/card";
import { Divider } from "@heroui/divider";
import React from "react";
import clsx from "clsx";

import { useMqtt } from "../mqtt-provider";

type Props = {
  lineCode: string;
  title: string;
};

const Sensor = ({ title, lineCode }: Props) => {
  const { client: mqtt } = useMqtt();
  const [isOnline, setIsOnline] = React.useState(false);
  const [bucketEmpty, setBucketEmpty] = React.useState(true);
  const [temperature, setTemperature] = React.useState(0);
  const [humidity, setHumidity] = React.useState(0);
  const [totalNG, setTotalNG] = React.useState(0);

  React.useEffect(() => {
    mqtt.current?.subscribe([
      `raptorfx02/${lineCode}/status`,
      `raptorfx02/${lineCode}/bucket`,
      `raptorfx02/${lineCode}/temperature`,
      `raptorfx02/${lineCode}/humidity`,
      `raptorfx02/${lineCode}/total_ng`,
    ]);
    mqtt.current?.on("message", (topic, message) => {
      switch (topic) {
        case `raptorfx02/${lineCode}/status`:
          setIsOnline(message.toString() === "online");
          break;
        case `raptorfx02/${lineCode}/temperature`:
          setTemperature(parseFloat(message.toString()));
          break;
        case `raptorfx02/${lineCode}/humidity`:
          setHumidity(parseFloat(message.toString()));
          break;
        case `raptorfx02/${lineCode}/bucket`:
          const bucketStatus = message.toString();

          setBucketEmpty(bucketStatus !== "true");
          break;
        case `raptorfx02/${lineCode}/total_ng`:
          setTotalNG(parseInt(message.toString(), 10));
          break;
      }
    });
  }, [mqtt.current]);

  return (
    <Card fullWidth className="p-6 pt-4">
      <h5 className="text-center font-bold text-primary">{title}</h5>
      <Divider className="mt-3 mb-4" />
      {isOnline ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div
              className="flex aspect-square w-full rounded-xl justify-center gap-4 items-center flex-col"
              style={{
                background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
                boxShadow: "8px 8px 16px #cccccc, -8px -8px 16px #ffffff",
              }}
            >
              <p className="text-sm text-primary">Suhu:</p>
              <p className="text-2xl text-primary font-semibold">{temperature}*C</p>
            </div>
            <div
              className="flex aspect-square w-full rounded-xl justify-center gap-4 items-center flex-col"
              style={{
                background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
                boxShadow: "8px 8px 16px #cccccc, -8px -8px 16px #ffffff",
              }}
            >
              <p className="text-sm text-primary">Lembab:</p>
              <p className="text-2xl text-primary font-semibold">{humidity}%</p>
            </div>
          </div>
          <div
            className="flex p-4 w-full rounded-xl justify-between gap-4 items-center"
            style={{
              background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
              boxShadow: "8px 8px 16px #cccccc, -8px -8px 16px #ffffff",
            }}
          >
            <p className="text-sm text-primary">Bucket Loader:</p>
            <p className={clsx("text-sm font-semibold", bucketEmpty ? "text-danger animate-pulse" : "text-primary")}>
              {bucketEmpty ? "KOSONG" : "ISI"}
            </p>
          </div>
          <div
            className="flex p-4 w-full rounded-xl justify-between gap-4 items-center"
            style={{
              background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
              boxShadow: "8px 8px 16px #cccccc, -8px -8px 16px #ffffff",
            }}
          >
            <p className="text-sm text-primary">Total NG:</p>
            <p className="text-sm text-danger font-semibold">{totalNG} PCS</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-center text-foreground-500">Sensor Offline</p>
        </div>
      )}
    </Card>
  );
};

export default Sensor;
