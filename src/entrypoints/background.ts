import { alarm, db, user_prefrences } from "@/db";

async function compareOsTimeWithInternetTime(): Promise<void> {
  const osTime = new Date();
  let internetTime: Date | null = null;

  try {
    const res = await fetch("https://www.google.com/generate_204", {
      method: "HEAD",
      // Important: service worker allows no-cors requests but headers may be unavailable
      mode: "no-cors",
    });

    const dateHeader = res.headers.get("Date");
    if (dateHeader) {
      internetTime = new Date(dateHeader);
    } else {
      throw new Error("Date header not available");
    }
  } catch (e2) {
    console.error("Both timeapi and Google fetch failed.");
    return;
  }
  if (internetTime) {
    const diffMs = osTime.getTime() - internetTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    browser.runtime.sendMessage({ type: "setDifference", diffMs });
  }
}
const default_timings = [
  { id: 1, time: "05:30" },
  { id: 2, time: "17:30" },
];
db.on("populate", () => {
  db.user_prefrences.add({ auto_click_on_set_time_enabled: true });
  db.alarms.bulkAdd(default_timings);
});
export default defineBackground(() => {
  (async () => {
    setInterval(async () => {
      await compareOsTimeWithInternetTime();
    }, 1000);
  })();
  browser.runtime.onMessage.addListener(
    (
      { action, data }: { action: string; data?: any },
      sender,
      sendResponse,
    ) => {
      switch (action) {
        case "getUserPreferences":
          db.user_prefrences.toArray().then((prefs: user_prefrences[]) => {
            sendResponse({ data: prefs });
          });
          return true; // <- keep the message channel open for async response
          break;
        case "getAlertTimings":
          db.alarms.toArray().then((alarms: alarm[]) => {
            sendResponse({
              data: { db_timings: alarms, default_timings },
            });
          });
          return true; // <- keep the message channel open for async response
          break;
        case "updateTimings":
          (async () => {
            await db.alarms.clear();
            await db.alarms.bulkPut(data);
          })();
          break;

        default:
          break;
      }
    },
  );
});
