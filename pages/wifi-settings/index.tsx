import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function WifiSettingsPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const connected = localStorage.getItem("wifiConnected") === "true";
    setIsConnected(connected);
  }, []);

  return (
    <Layout>
      <div className="w-full max-w-xl mx-auto py-20 text-black">
        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4" aria-label="Kembali">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">WiFi Settings</h2>
          </div>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <form className="bg-white space-y-4 text-black">
          <div>
            <label htmlFor="ssid" className="block font-medium text-sm mb-1">
              Network Name (SSID)
            </label>
            <input
              id="ssid"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Contoh: MyWiFi"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-sm mb-1">
              WiFi Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Masukkan kata sandi"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold"
          >
            Try to Connect
          </button>
        </form>
      </div>
    </Layout>
  );
}
