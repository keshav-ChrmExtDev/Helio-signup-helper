<script lang="ts">
  import type { Submit_button_states } from "@/types";
  type Props = {
    tooltip?: string;
    class?: string;
    state: Submit_button_states;
    onclick?: Function;
    label_icon?: string;
    children?: any;
  };
  let {
    tooltip,
    class: classes,
    state,
    onclick,
    label_icon,
    children,
    ...props
  }: Props = $props();
</script>

<div class="tooltip h-auto" data-tip={tooltip}>
  <button
    class="
    {state == 'disabled' ? 'btn-disabled' : ''}
    {state == 'waiting' ? 'btn-info' : ''}
    {state == 'success' ? 'btn-success' : ''}
    {state == 'error'
      ? ' btn-error '
      : ''} w-full min-w-min btn btn-lg flex gap-4 {classes} "
    onclick={(e) => {
      if (onclick) {
        onclick(e);
      }
    }}
    disabled={state == "disabled" || state == "waiting"}
    {...props}
  >
    <span class="gap-4 flex justify-center items-center">
      {#if label_icon}
        <div class="size-7 {label_icon}"></div>
      {/if}
      {#if children}
        <p>{@render children?.()}</p>
      {:else}
        <p>Submit</p>
      {/if}
    </span>
    {#if state == "waiting"}
      <div class="i-line-md:loading-twotone-loop size-8"></div>
    {:else if state == "success"}
      <div class="i-tabler:check size-8"></div>
    {:else if state == "error"}
      <div class="i-tabler:alert-triangle size-8"></div>
    {:else}{/if}
  </button>
</div>
