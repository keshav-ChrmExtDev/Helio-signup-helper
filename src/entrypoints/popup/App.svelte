<script lang="ts">
  import SubmitButton from "@/components/common/submit_button.svelte";
  import type { Submit_button_states } from "@/types";

  let response: string | undefined = $state();
  async function start_pinging() {
    submit_state = "waiting";
    try {
      while (true) {
        const res = await fetch(
          "https://heliohost.org/signup/reserve/?server=johnny",
        );
        if (res.url.includes("?error=full")) {
          response = "Signups Not Open Yet";
        }
        submit_state = "success";
      }
    } catch (e) {
      submit_state = "error";
      console.error("Nothing Happened");
    }
  }

  let submit_state: Submit_button_states = $state("idle");
</script>

<main class="flex flex-col p-4">
  <div class="">
    <p class="text-3xl font-bold text-center">Helio Host Signup Helper</p>
    <p class="text-center">Helps you SIgnup for the Free (Johny) Plan</p>
  </div>
  <div class="divider"></div>
  <SubmitButton
    onclick={start_pinging}
    state={submit_state}
    label_icon="i-tabler:cloud-question"
  >
    Ping Now!
  </SubmitButton>
  {#if response}
    <div role="alert" class="alert alert-info alert-soft">
      <span>{response}</span>
    </div>
  {/if}
</main>
