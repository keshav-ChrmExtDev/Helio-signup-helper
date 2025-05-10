import { defineConfig } from "unocss";
import presetMini, { Theme } from "@unocss/preset-mini";
import presetIcons from "@unocss/preset-icons";
import transformerVariantGroup from "@unocss/transformer-variant-group";
import { presetDaisy } from "@ameinhardt/unocss-preset-daisy";
import theme from "daisyui/functions/variables.js";
const { rules, ...preset } = presetMini();
export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [
    presetIcons({}),
    presetMini(),
    presetDaisy(),
    {
      ...preset,
      rules: rules!.filter(([selector]) => selector !== "table"),
    },
  ],
  theme: {
    ...(theme as Theme),
    // colors: colors as Record<string, string>
  },
});
