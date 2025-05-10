const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerResi = (resi: string) =>
  fetch(`${API_URL}/alarm/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resi }),
  }
);

export const getPacketByResi = async (resiId: string) => {
  const res = await fetch(`${API_URL}/packets/${resiId}`);
  const data = await res.json();

  if (!res.ok || data.status !== "success") {
    throw new Error("Gagal memuat data paket");
  }

  return data.data;
};

export const getTotalPackets = async (): Promise<number> => {
  const res = await fetch(`${API_URL}/packets/total`);
  console.log(API_URL)
  if (!res.ok) throw new Error("Gagal mengambil data total paket");
  const data = await res.json();
  return data.total;
};
  
export const createPacket = async ({
  resi,
  customer_name,
  address,
  order,
}: {
  resi: string;
  customer_name: string;
  address: string;
  order: string;
}) => {
  const res = await fetch(`${API_URL}/packets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resi, customer_name, address, order }),
  });

  if (!res.ok) throw new Error("Gagal menambahkan paket");

  return res.json();
};

export const updatePacket = async (
  id: number,
  data: {
    resi: string;
    customer_name: string;
    address: string;
    order: string;
  }
) => {
  const res = await fetch(`${API_URL}/packets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal mengupdate paket");

  return res.json();
};

export async function deletePacket(id: number) {
  const res = await fetch(`${API_URL}/packets/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Gagal menghapus paket");
  }

  return res;
}
