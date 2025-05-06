<script lang="ts">
  import SubmitButton from "@/components/common/submit_button.svelte";
  import type { Submit_button_states } from "@/types";
  import NumberFlow from "@number-flow/svelte";
  let response: string | undefined = $state();
  let time_diffrence: number | undefined = $state();

  browser.runtime.onMessage.addListener((message) => {
    if (message.type === "setDifference") {
      time_diffrence = message.diffMs;
    }
  });

  async function start_clicking() {
    submit_state = "waiting";
    try {
      while (true) {
        const res = await fetch(
          "https://heliohost.org/signup/reserve/?server=johnny",
        );
        if (res.url.includes("?error=full")) {
          response = "Signups Not Open Yet";
        } else {
          submit_state = "success";
          response = "Something Else Happened" + res.url;
          console.log(res.url);
          break;
        }
      }
    } catch (e) {
      submit_state = "error";
      if (e instanceof Error) {
        response = e.message;
      }
      console.error("Nothing Happened");
    }
  }

  let submit_state: Submit_button_states = $state("idle");
  $inspect(time_diffrence);
</script>

<main class="flex flex-col p-4">
  <div class="">
    <p class="text-3xl font-bold text-center">Helio Host Signup Helper</p>
    <p class="text-center">Helps you SIgnup for the Free (Johny) Plan</p>
  </div>
  <div class="divider"></div>

  <!-- Time Diffrence Section -->
  <section class="flex flex-col">
    <div class="flex items-center gap-3">
      <div class="i-tabler:clock-hour-4-filled size-6"></div>
      <p class="text-xl">Time Diffrence</p>
    </div>
    <div class="flex gap-2 items-center mx-auto">
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
          <input type="checkbox" />
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
  {#if response}
    <div role="alert" class="alert alert-info alert-soft">
      <span class="truncate">{response}</span>
    </div>
  {/if}
</main>
