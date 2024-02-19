import axios from "axios";

export async function start() {
  await axios.post("/api/repeat/start");
}

export async function stop() {
  await axios.post("/api/repeat/stop");
}

export async function status() {
  const response = await axios.post("/api/repeat/status");
  console.log(response);
  return {
    running: response.data.message.status,
    lastUpdated: new Date(response.data.message.lastUpdated),
  };
}
