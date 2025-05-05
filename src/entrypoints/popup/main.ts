import { mount } from "svelte";
import App from "./App.svelte";
import "@unocss/reset/tailwind-compat.css";
import "uno.css";
const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
