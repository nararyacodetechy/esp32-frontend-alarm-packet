'use client';

import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const goToWifiSettings = () => {
    router.push("/wifi-settings");
  };

  const isConnected = false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-black">
      <header className="bg-blue-600 text-white py-4 shadow-md px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Alarm Tag</h1>
        <button
          onClick={goToWifiSettings}
          aria-label="WiFi Settings"
          className="ml-4"
        >
          {isConnected ? (
            <Wifi className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
          ) : (
            <WifiOff className="w-6 h-6 text-white hover:text-gray-200 cursor-pointer" />
          )}
        </button>
      </header>

      <main className="flex-1 flex justify-center items-start mt-8 px-4">
        {children}
      </main>
    </div>
  );
}
