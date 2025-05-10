import { alarm } from "@/db";

let timeouts: number[] = [];
function scheduleTimings(
  timings: alarm[],
  callback: (timing: alarm) => void,
): void {
  timeouts.forEach((id) => clearTimeout(id));
  for (const timing of timings) {
    const [h, m] = timing.time.split(":").map(Number);
    const now = new Date();
    const target = new Date(now);
    target.setHours(h, m, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    const id = setTimeout(
      () => callback(timing),
      target.getTime() - now.getTime(),
    );
    timeouts.push(id);
  }
}

export default defineContentScript({
  matches: ["https://heliohost.org/signup/*"],
  main(ctx) {
    const countdown = document.querySelector("#countdown_johnny");
    if (!countdown) return;
    const aElemet = countdown.closest("a");
    browser.runtime.sendMessage(
      { action: "getAlertTimings" },
      ({
        data,
      }: {
        data: { db_timings: alarm[]; default_timings: alarm[] };
      }) => {
        scheduleTimings(data.db_timings, () => {
          aElemet?.click();
        });
      },
    );

    browser.runtime.onMessage.addListener(
      ({ action, data }: { action: string; data: alarm[] }) => {
        switch (action) {
          case "updateTimings":
            scheduleTimings(data, () => {
              aElemet?.click();
            });
            break;

          default:
            break;
        }
      },
    );
  },
});
