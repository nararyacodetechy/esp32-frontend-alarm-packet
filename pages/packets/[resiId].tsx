import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { turnOn, turnOff, resetAlarm } from "@/lib/alarmService";
import { ArrowLeft } from "lucide-react";
import { updatePacket, deletePacket, getPacketByResi } from "@/lib/packetService";
import { toast, Toaster } from "react-hot-toast"; // ✅ Tambahkan ini

type Packet = {
  id: number;
  resi: string;
  customer_name: string;
  address: string;
  order: string;
};

export default function PacketDetail() {
  const router = useRouter();
  const { resiId } = router.query;

  const [packet, setPacket] = useState<Packet | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Tidak diketahui");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    resi: '',
    customer_name: '',
    address: '',
    order: ''
  });

  useEffect(() => {
    if (!resiId || typeof resiId !== "string") return;
  
    const fetchData = async () => {
      try {
        const data = await getPacketByResi(resiId);
        setPacket(data);
        setForm({
          resi: data.resi,
          customer_name: data.customer_name,
          address: data.address,
          order: data.order,
        });
        setError("");
      } catch (err) {
        setError("Gagal menghubungi server.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [resiId]);  

  const handleRequest = async (
    cb: () => Promise<Response>,
    successText?: string
  ) => {
    try {
      const res = await cb();
      const text = await res.text();
      setStatus(successText || text);
    } catch {
      setStatus("Gagal melakukan aksi.");
    }
  };
  
  const handleUpdate = async () => {
    if (!packet) return;
    try {
      await updatePacket(packet.id, form);
      toast.success("✅ Paket berhasil diperbarui");
      setPacket({ ...packet, ...form });
      setIsEditing(false);
    } catch (err) {
      setStatus("❌ Gagal memperbarui paket");
    }
  };

  const handleDelete = async () => {
    if (!packet) return;
  
    const confirmDelete = confirm("Yakin ingin menghapus paket ini?");
    if (!confirmDelete) return;
  
    try {
      await deletePacket(packet.id);
      toast.success("✅ Paket berhasil dihapus");
      router.push("/"); // Ganti path sesuai halaman list kamu
    } catch (err) {
      toast.error("❌ Gagal menghapus paket");
    }
  };
  

  const getStatusClass = (status: string) => {
    if (status.includes("nyala") || status.toLowerCase().includes("dinya")) {
      return "bg-green-100 text-green-700";
    } else if (status.includes("mati") || status.toLowerCase().includes("dimatikan")) {
      return "bg-red-100 text-red-700";
    } else {
      return "bg-gray-200 text-gray-700";
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="w-full max-w-xl mx-auto px-4 py-6 text-black">

        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-4" aria-label="Kembali">
              <ArrowLeft className="w-6 h-6 text-blue-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Detail Paket</h2>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>

        {loading ? (
          <p>Memuat detail paket...</p>
        ) : error ? (
          <div className="text-red-600">❌ {error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            {["resi", "customer_name", "address", "order"].map((field) => (
              <div key={field}>
                <label className="font-semibold capitalize">{field.replace("_", " ")}:</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={form[field as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                ) : (
                  <p>{packet?.[field as keyof Packet]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-between pt-0 pb-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    onClick={() => {
                      setForm({
                        resi: packet!.resi,
                        customer_name: packet!.customer_name,
                        address: packet!.address,
                        order: packet!.order,
                      });
                      setIsEditing(false);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleRequest(() => turnOn(packet!.resi), "Alarm dinyalakan 🔊")}
                className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg font-medium"
              >
                Nyalakan Alarm
              </button>
              <button
                onClick={() => handleRequest(() => turnOff(packet!.resi), "Alarm dimatikan 🔕")}
                className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg font-medium"
              >
                Matikan Alarm
              </button>
              <button
                onClick={() => handleRequest(() => resetAlarm(packet!.resi), "Alarm di-reset 🔄")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg font-medium"
              >
                Reset Alarm
              </button>

              {/* Add Delete button */}
              <button
                onClick={handleDelete}
                className="w-full bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg font-medium mt-4"
              >
                Hapus Paket
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
