const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const registerWiFi = (ssid: string, password: string) =>
  fetch(`${API_URL}/alarm/registerWiFi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ssid, password }),
  });
