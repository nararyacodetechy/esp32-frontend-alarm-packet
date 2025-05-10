const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const turnOn = (resi?: string) =>
    fetch(`${API_URL}/alarm/on${resi ? `?resi=${resi}` : ""}`);

export const turnOff = (resi?: string) =>
    fetch(`${API_URL}/alarm/off${resi ? `?resi=${resi}` : ""}`);

export const resetAlarm = (resi?: string) =>
    fetch(`${API_URL}/alarm/reset${resi ? `?resi=${resi}` : ""}`);
