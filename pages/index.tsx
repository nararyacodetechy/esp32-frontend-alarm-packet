import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getTotalPackets } from "@/lib/packetService";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [totalPackets, setTotalPackets] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [packets, setPackets] = useState<any[]>([]);
  const router = useRouter();

  const fetchPacketsData = async () => {
    try {
      const total = await getTotalPackets();
      setTotalPackets(total);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/packets`);
      if (!res.ok) throw new Error("Gagal mengambil daftar paket");
      const data = await res.json();
      setPackets(data);
    } catch (error) {
      console.error("Error fetching packets data:", error);
    }
  };

  useEffect(() => {
    fetchPacketsData();
  }, []);

  const filteredPackets = packets.filter((packet) =>
    packet.resi.toLowerCase().includes(searchQuery.toLowerCase()) ||
    packet.order.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetail = (resi: string) => {
    router.push(`/packets/${resi}`); // Arahkan ke halaman detail berdasarkan resi
  };

  const handleAddPacket = () => {
    router.push("/packets/addnew"); // Arahkan ke halaman register paket
  };

  return (
    <Layout>
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-6xl mx-auto text-black">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Dashboard Paket</h1>
          <div className="mt-2 text-lg">Total Paket: {totalPackets}</div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between mb-6">
          {/* Tombol Tambah Paket */}
          <div className="w-full md:w-1/4">
            <button
              onClick={handleAddPacket}
              className="bg-blue-500 w-full p-3 hover:bg-blue-600 text-white rounded-lg text-sm"
            >
              Tambah Paket
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:w-3/4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Paket (Nomor Resi / Pesanan)"
              className="w-full border p-2.5 border-gray-300 rounded-xl text-black"
            />
          </div>
        </div>

        {/* Grid Layout for Packets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackets.map((packet) => (
            <div
              key={packet.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold">{packet.resi}</h3>
              <p className="mt-2 text-gray-700">Pesanan: {packet.order}</p>
              <p className="mt-1 text-gray-500 text-sm">Nama: {packet.customer_name}</p>
              <p className="mt-1 text-gray-500 text-sm">Alamat: {packet.address}</p>
              <p className="mt-2 text-gray-600">Status: {packet.status}</p>
              <button
                onClick={() => handleViewDetail(packet.resi)}
                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 w-full rounded-lg text-sm"
              >
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
