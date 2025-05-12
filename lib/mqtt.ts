import mqtt from "mqtt";

export const connectToMqtt = () => {
  const client = mqtt.connect('wss://11a48318309b4e50a086a4a302a7bfd3.s1.eu.hivemq.cloud:8884/mqtt', {
    username: 'radityanara',
    password: 'RadityaNara321',
  });

  client.on('connect', () => {
    console.log('Terhubung ke broker MQTT');
    client.subscribe('alarm/status', (err) => {
      if (!err) {
        console.log('Berhasil subscribe ke topik alarm/status');
      } else {
        console.log('Gagal subscribe:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    console.log(`Pesan diterima pada topik ${topic}: ${message.toString()}`);
  });

  return client;
};
    