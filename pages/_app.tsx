import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MqttProvider } from "../context/MqttContext"; // pastikan path benar

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MqttProvider>
      <Component {...pageProps} />
    </MqttProvider>
  );
}
