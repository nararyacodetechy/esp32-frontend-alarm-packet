// context/MqttContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

interface MqttContextProps {
    client: MqttClient | null;
    setClient: React.Dispatch<React.SetStateAction<MqttClient | null>>; // ✅ tambahkan ini
    isConnected: boolean;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>; // ✅ tambahkan ini
}

const MqttContext = createContext<MqttContextProps>({
    client: null,
    setClient: () => {},
    isConnected: false,
    setIsConnected: () => {},
});

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

    mqttClient.on("connect", () => {
      console.log("✅ Terhubung ke broker MQTT");
      mqttClient.subscribe("alarm/status", (err) => {
        if (!err) console.log("✅ Berhasil subscribe ke topik alarm/status");
      });
      setIsConnected(true);
    });

    mqttClient.on("error", (error) => {
      console.error("❌ MQTT Error:", error);
    });

    mqttClient.on("close", () => {
      console.log("🔌 Koneksi MQTT ditutup");
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      // Jangan end saat berpindah halaman. Hanya jika benar-benar ingin putuskan secara manual.
    };
  }, []);

  return (
    <MqttContext.Provider value={{ client, setClient, isConnected, setIsConnected }}>
        {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
