export default defineContentScript({
  matches: ["https://heliohost.org/signup/*"],
  main(ctx) {
    const countdown = document.querySelector("#countdown_johnny");
    if (!countdown) return;
    const aElemet = countdown.closest("a");
  },
});
