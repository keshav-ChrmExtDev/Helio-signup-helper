import { defineConfig } from "unocss";
import presetMini from "@unocss/preset-mini";
import presetIcons from "@unocss/preset-icons";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { presetDaisy } from "@ameinhardt/unocss-preset-daisy";
export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [presetIcons({}), presetMini(), presetDaisy()],
});
