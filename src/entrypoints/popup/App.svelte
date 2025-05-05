<script lang="ts">
  import SubmitButton from "@/components/common/submit_button.svelte";
  import type { Submit_button_states } from "@/types";

  let response: string | undefined = $state();
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
</script>

<main class="flex flex-col p-4">
  <div class="">
    <p class="text-3xl font-bold text-center">Helio Host Signup Helper</p>
    <p class="text-center">Helps you SIgnup for the Free (Johny) Plan</p>
  </div>
  <div class="divider"></div>
  <SubmitButton
    onclick={start_clicking}
    state={submit_state}
    label_icon="i-tabler:cloud-question"
  >
    Start Checking
  </SubmitButton>
  <p>Click this button when the Signup Portal is about to open.</p>
  {#if response}
    <div role="alert" class="alert alert-info alert-soft">
      <span class="truncate">{response}</span>
    </div>
  {/if}
</main>
