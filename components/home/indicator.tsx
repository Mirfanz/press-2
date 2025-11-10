"use client";

import React from "react";
import { Alert } from "@heroui/alert";

import { useMqtt } from "../mqtt-provider";

type Props = {};

const Indicator = (props: Props) => {
  const mqtt = useMqtt();

  if (!mqtt.isConnected)
    return (
      <Alert
        color="danger"
        description="Data sensor terbaru gagal dimuat. Mengubungkan ulang..."
        title="Menghubungkan MQTT"
        variant="faded"
      />
    );
};

export default Indicator;
