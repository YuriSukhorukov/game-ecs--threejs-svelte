<script lang="ts">
  import { ROUND_STATUS } from '$stores/roundStore'
	// import { BUTTON_STATES } from './types';
  import styles from './styles.module.scss'

  export let onStart: () => void;
  export let onCancel: () => void;
  export let onCashOut: () => void;
  export let state: ROUND_STATUS = null;
  export let reward: string | null = null;
</script>

<div class={styles.container}>
  {#if state === ROUND_STATUS.NOT_STARTED || state === ROUND_STATUS.FINISHED}
    <button on:click={onStart} disabled={state === ROUND_STATUS.FINISHED}>Place bet</button>
  {:else if state === ROUND_STATUS.STARTED}
    <button on:click={onCancel}>Cancel</button>
  {:else if state === ROUND_STATUS.IN_PROGRESS}
    <button on:click={onCashOut}>
      <div>Cash Out</div>
      <div>{reward ?? ""}</div>
    </button>
  {/if}
</div>