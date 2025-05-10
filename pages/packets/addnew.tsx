import { useState } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "react-hot-toast"; // ✅ Tambahkan ini
import { createPacket } from "@/lib/packetService";

export default function AddNewPacket() {
  const router = useRouter();
  const [resi, setResi] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [order, setOrder] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resi || !customerName || !address || !order) {
      setError("Semua kolom harus diisi");
      return;
    }

    try {
      await createPacket({
        resi,
        customer_name: customerName,
        address,
        order,
      });

      toast.success("Paket berhasil ditambahkan!");
      setTimeout(() => router.push("/"), 1500); // delay untuk memberi waktu toast muncul
    } catch (err) {
      toast.error("Gagal menambahkan paket.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="w-full max-w-lg mx-auto">
        {/* ✅ Toaster untuk menampilkan notifikasi */}
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex items-center mb-6 justify-between">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4" aria-label="Kembali">
              <ArrowLeft className="w-6 h-6 text-blue-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Tambah Paket pada Alat</h2>
          </div>
        </div>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-lg text-black">
          <div>
            <label className="block font-medium mb-2">Nomor Resi</label>
            <input
              type="text"
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Nomor Resi"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Nama Pelanggan</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Nama Pelanggan"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Alamat</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Alamat"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Pesanan</label>
            <input
              type="text"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Pesanan"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Simpan Paket
          </button>
        </form>
      </div>
    </Layout>
  );
}
