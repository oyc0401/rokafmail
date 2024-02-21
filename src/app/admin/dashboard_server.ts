import axios from "axios";

export async function startMailCron() {
  await axios.post("/api/retry/mail/cron/start");
}

export async function stopMailCron() {
  await axios.post("/api/retry/mail/cron/stop");
}

export async function statusMailCron() {
  const response = await axios.post("/api/retry/mail/cron/status");
  return {
    running: response.data.message.status,
    lastUpdated: new Date(response.data.message.lastUpdated),
  };
}

export async function startUserCron() {
  await axios.post("/api/retry/user/cron/start");
}

export async function stopUserCron() {
  await axios.post("/api/retry/user/cron/stop");
}

export async function statusUserCron() {
  const response = await axios.post("/api/retry/user/cron/status");
  return {
    running: response.data.message.status,
    lastUpdated: new Date(response.data.message.lastUpdated),
  };
}