"use client";
import mqtt from "mqtt";
import React from "react";

const MqttContext = React.createContext<{
  client: React.MutableRefObject<mqtt.MqttClient | null>;
  isConnected: boolean;
  publish: (topic: string, message: string) => void;
  subscribe: (...name: string[]) => void;
} | null>(null);

const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const clientRef = React.useRef<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  const publish = (topic: string, message: string) => {
    if (clientRef.current) {
      clientRef.current.publish(topic, message);
    }
  };

  const subscribe = (...name: string[]) => {
    if (clientRef.current) {
      name.forEach((topic) => {
        clientRef.current?.subscribe(topic);
      });
    }
  };

  React.useEffect(() => {
    const client = mqtt.connect("wss://test.mosquitto.org:8081");

    clientRef.current = client;

    client.on("connect", () => {
      console.log("MQTT Connected");
      setIsConnected(true);
    });

    client.on("disconnect", () => {
      console.log("MQTT Disconnected");
      setIsConnected(false);
    });

    client.on("message", (topic, message) => {
      console.log("MQTT : ", topic, " - ", message.toString());
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <MqttContext.Provider
      value={{ client: clientRef, publish, subscribe, isConnected }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = React.useContext(MqttContext);

  if (!context) throw new Error("useMqtt must be used within MqttProvider");

  return context;
};

export default MqttProvider;
