import { useState } from "react";
import Layout from "@/components/Layout";
import { registerWiFi } from "@/lib/wifiService";

export default function RegisterWiFi() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!ssid || !password) return alert("Isi SSID dan Password");
    try {
      await registerWiFi(ssid, password);
      setStatus(`Wi-Fi Terdaftar: ${ssid}`);
    } catch {
      setStatus("Gagal mendaftarkan Wi-Fi");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold">Daftarkan Wi-Fi</h2>
        <input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="SSID" className="w-full p-2 border rounded-xl" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded-xl" />
        <button onClick={handleSubmit} className="bg-yellow-500 text-black w-full p-2 rounded-xl">Daftarkan</button>
        <div className="text-sm text-gray-600">{status}</div>
      </div>
    </Layout>
  );
}
