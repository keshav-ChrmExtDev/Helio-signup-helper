<script lang="ts">
  import type { alarm, user_prefrences } from "@/db";
  import NumberFlow from "@number-flow/svelte";
  import { backOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  let time_diffrence: number | undefined = $state();
  let is_auto_click_enabled: boolean | undefined = $state();
  let click_schedules_initial: alarm[] = $state([]);
  let click_schedules_mutable: alarm[] = $state([]);

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
  browser.runtime.sendMessage(
    { action: "getAlertTimings" },
    ({ data }: { data: { db_timings: alarm[]; default_timings: alarm[] } }) => {
      click_schedules_initial = data.default_timings;
      click_schedules_mutable = data.db_timings;
    },
  );

  function add_new_timing() {
    const last = click_schedules_mutable[click_schedules_mutable.length - 1];
    click_schedules_mutable.push({ id: last.id + 1, time: "" });
  }
  function remove_row_by_id(id: number) {
    click_schedules_mutable = click_schedules_mutable.filter((v) => v.id != id);
  }
  function reset_click_schedules() {
    click_schedules_mutable = click_schedules_initial;
  }
  $effect(() => {
    browser.runtime.sendMessage({
      action: "updateTimings",
      data: click_schedules_mutable,
    });
  });
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
      <li class="list-row flex justify-between items-center">
        <p class="">Autoclicker enabled?</p>
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
      <li class="list-row flex-col flex">
        <div class="flex justify-between items-center">
          <p>Click Schedules</p>
          <button
            class="btn btn-sm btn-soft"
            aria-label="Reset Click Schedules"
            onclick={reset_click_schedules}
            ><div class="i-tabler:refresh size-5"></div></button
          >
        </div>
        <ul class="list bg-base-100 rounded-box shadow-md overflow-y-auto">
          {#each click_schedules_mutable as click_schedule (click_schedule.id)}
            <li transition:fly={{ y: +10, easing: backOut }} class="list-row">
              <input
                type="time"
                class="input list-col-grow"
                bind:value={click_schedule.time}
              />
              <button
                class="btn btn-sm h-full"
                aria-label="Remove Timing"
                onclick={() => {
                  remove_row_by_id(click_schedule.id);
                }}
              >
                <div class="i-tabler:trash-filled color-error size-5"></div>
              </button>
            </li>
          {:else}
            <li class="p-4 pb-2 text-xs opacity-60 tracking-wide">
              Nothing to Show
            </li>
          {/each}
          <li class="list-row">
            <button class="btn list-col-grow" onclick={add_new_timing}>
              Add
              <div class="i-tabler:circle-plus-filled size-5"></div>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</main>
