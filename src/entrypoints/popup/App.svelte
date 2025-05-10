<script lang="ts">
  import type { user_prefrences } from "@/db";
  import NumberFlow from "@number-flow/svelte";
  let time_diffrence: number | undefined = $state();
  let is_auto_click_enabled: boolean | undefined = $state();

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === "setDifference") {
      time_diffrence = message.diffMs;
    }
  });

  browser.runtime.sendMessage(
    { action: "getUserPreferences" },
    ({ data }: { data: user_prefrences[] }) => {
      const prefs = data;
      if (prefs && prefs.length > 0) {
        is_auto_click_enabled = prefs[0].auto_click_on_set_time_enabled;
      }
    },
  );
</script>

<main class="flex flex-col p-4">
  <div class="">
    <p class="text-3xl font-bold text-center">Helio Host Signup Helper</p>
    <p class="text-center">Helps you SIgnup for the Free (Johny) Plan</p>
  </div>
  <div class="divider"></div>

  <!-- Time Diffrence Section -->
  <section class="flex gap-2 flex-col">
    <div class="flex items-center gap-3">
      <div class="i-tabler:clock-hour-4-filled size-6"></div>
      <p class="text-xl">Time Diffrence</p>
    </div>
    <p class="color-white/80">
      The Time diffrence of your OS Time & Internet Time that Helio Host uses
    </p>
    <div
      class="flex gap-2 items-center mx-auto tooltip
      {Math.abs(time_diffrence || 0) > 200
        ? 'color-error tooltip-error'
        : Math.abs(time_diffrence || 0) > 100
          ? 'color-warning tooltip-warning'
          : ''}
            "
      data-tip="
        {Math.abs(time_diffrence || 0) > 200
        ? 'Very likely to Miss the Opening time '
        : Math.abs(time_diffrence || 0) > 100
          ? 'likely to miss the opening time'
          : ''}
      "
    >
      <NumberFlow value={time_diffrence || 0} class="text-3xl " />ms
    </div>
  </section>

  <!-- Set Auto Clicker on exact time Section -->
  <section class=" mt-4 flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <div class="i-tabler:settings-filled size-6"></div>
      <p class="text-xl">Options</p>
    </div>
    <ul class="list">
      <li class="list-row flex justify-between">
        <p class="text-lg">Autoclicker enabled?</p>
        <label class="toggle text-base-content toggle-xl">
          <input type="checkbox" bind:checked={is_auto_click_enabled} />
          <div
            class="i-tabler:x size-6 bg-black z-6"
            aria-label="enabled"
          ></div>
          <div
            class="i-tabler:check size-6 bg-black z-6"
            aria-label="enabled"
          ></div>
        </label>
      </li>
    </ul>
  </section>
</main>
