'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useMqtt } from "@/context/MqttContext";
import mqtt from "mqtt";

const MqttConnectPage = () => {
  const router = useRouter();
  const { client, setClient, isConnected, setIsConnected } = useMqtt();
  const [message, setMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [connecting, setConnecting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!client) return;

    const messageHandler = (topic: string, msg: Buffer) => {
      if (topic === "alarm/status") {
        setMessage(msg.toString());
        setLogs((prev) => [...prev, `📨 Message from '${topic}': ${msg.toString()}`]);
      }
    };

    client.on("message", messageHandler);
    return () => {
      client.off("message", messageHandler);
    };
  }, [client]);

  const handleConnect = () => {
    if (connecting || isConnected) return;

    setConnecting(true);
    setLogs((prev) => [...prev, "🔄 Connecting to MQTT broker..."]);

    const mqttClient = mqtt.connect("ws://broker.emqx.io:8083/mqtt");

    mqttClient.on("connect", () => {
      setLogs((prev) => [...prev, "✅ Connected to MQTT broker"]);
      mqttClient.subscribe("alarm/status", (err) => {
        if (!err) {
          setLogs((prev) => [...prev, "📡 Successfully subscribed to 'alarm/status'"]);
        } else {
          setLogs((prev) => [...prev, "⚠️ Failed to subscribe to 'alarm/status'"]);
        }
      });
      setClient(mqttClient);
      setIsConnected(true);
      setConnecting(false);
    });

    mqttClient.on("error", (error) => {
      console.error("MQTT Error:", error);
      setLogs((prev) => [...prev, `❌ MQTT Error: ${error.message}`]);
      setConnecting(false);
    });

    mqttClient.on("close", () => {
      setLogs((prev) => [...prev, "🔌 MQTT connection closed"]);
      setIsConnected(false);
    });
  };

  const handleDisconnect = () => {
    if (client) {
      client.end(true);
      setLogs((prev) => [...prev, "🔌 MQTT connection manually disconnected"]);
      setClient(null);
      setIsConnected(false);
    }
  };

  

  return (
    <Layout>
      <div className="w-full max-w-xl mx-auto py-20 text-black">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4" aria-label="Back">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">MQTT Connect</h2>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">MQTT Connection Status</h3>
          <p className="text-sm text-gray-500">
            MQTT connection status: {isConnected ? "Connected" : connecting ? "Connecting..." : "Disconnected"}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleConnect}
              disabled={connecting || isConnected}
              className={`px-4 py-2 rounded text-white ${
                connecting || isConnected ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {connecting ? "Connecting..." : "Try to Connect"}
            </button>
            <button
              onClick={handleDisconnect}
              disabled={!isConnected}
              className={`px-4 py-2 rounded text-white ${
                !isConnected ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Disconnect
            </button>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700">Latest Message:</h4>
            <p className="text-sm text-gray-500">{message || "No message received."}</p>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Terminal Log:</h4>
            <div className="bg-black text-green-400 p-3 rounded-md h-48 overflow-y-auto text-sm font-mono shadow-inner">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet.</p>
              ) : (
                logs.map((log, idx) => <div key={idx}>{log}</div>)
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MqttConnectPage;
