export default defineBackground(() => {
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
        console.log("Fetched from Google Date header");
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
  (async () => {
    setInterval(async () => {
      await compareOsTimeWithInternetTime();
    }, 1000);
  })();
});
