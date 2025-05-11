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
  const [status, setStatus] = useState("Unknown");
  const [error, setError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

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
        setError("Failed to contact server, please check your internet connection!");
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
      setStatus("Failed to perform action.");
    }
  };
  
  const handleUpdate = async () => {
    if (!packet) return;
    try {
      await updatePacket(packet.id, form);
      toast.success("✅ Packet successfully updated");
      setPacket({ ...packet, ...form });
      setIsEditing(false);
    } catch (err) {
      setStatus("❌ Failed to update packet");
    }
  };

  const handleDelete = async () => {
    if (!packet) return;
  
    const confirmDelete = confirm("Are you sure you want to delete this package?");
    if (!confirmDelete) return;
  
    try {
      setIsNavigating(true);
      await deletePacket(packet.id);
      toast.success("✅ Packet successfully deleted");
      await router.push("/"); // menunggu push selesai
    } catch (err) {
      toast.error("❌ Failed to remove packet");
    } finally {
      setIsNavigating(false);
    }
  };
  

  const getStatusClass = (status: string) => {
    const lowerStatus = status.toLowerCase();
  
    if (lowerStatus.includes("on") || lowerStatus.includes("activated")) {
      return "bg-green-100 text-green-700";
    } else if (lowerStatus.includes("off") || lowerStatus.includes("deactivated")) {
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
      <div className="w-full max-w-xl pt-16 pb-16 h-screen mx-auto text-black flex flex-col relative">

        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex items-center justify-between mb-5 bg-white sticky top-0 z-10 py-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="mr-3" aria-label="Back">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">Packet Details</h2>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>


        <div className="overflow-y-auto flex-grow px-1 pb-6">
          {loading ? (
            <p>Loading packet Details...</p>
          ) : error ? (
            <div className="text-red-600">❌ {error}</div>
          ) : (
            <div className="bg-white space-y-4">
              {["resi", "customer_name", "address", "order"].map((field) => {
                const label =
                  field === "resi"
                    ? "Receipt Number"
                    : field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

                return (
                  <div key={field}>
                    <label className="font-semibold">{label}:</label>
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
                );
              })}


              <div className="flex justify-between pt-0 pb-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
                    >
                      Save Changes
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
                      Cancel
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

              <div className="space-y-4">
                <button
                  onClick={() => handleRequest(() => turnOn(packet!.resi), "Alarm is turned on 🔊")}
                  className="w-full border border-green-700 text-green-700 p-2 rounded-lg font-medium"
                >
                  Turn On the Alarm
                </button>
                <button
                  onClick={() => handleRequest(() => turnOff(packet!.resi), "Alarm is turned off 🔕")}
                  className="w-full border border-red-700 text-red-700 p-2 rounded-lg font-medium"
                >
                  Turn Off the Alarm
                </button>
                <button
                  onClick={() => handleRequest(() => resetAlarm(packet!.resi), "Alarm has been reset 🔄")}
                  className="w-full border border-gray-700 text-gray-700 p-2 rounded-lg font-medium"
                >
                  Reset Alarm
                </button>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isNavigating}
          className="w-full border bg-red-700 hover:bg-red-600 text-white p-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete (Remove)
        </button>
      </div>
    </Layout>
  );
}
