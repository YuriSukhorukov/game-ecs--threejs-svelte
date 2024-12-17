<script lang="ts">
  import styles from './styles.module.scss'
  export let disabled: boolean | null = false
  export let height;
  export let onClick = () => {}
</script>

<div class="container" style="--height: {height}">
  <button on:click={onClick} disabled={disabled}>
    <slot />
  </button>
</div>

<style lang="scss">
  .container {
    width: 100%;
    button {
      width: 100%;
      // height: calc(5 * var(--gutter-height));
      height: calc(var(--height) * var(--gutter-height));
      border-radius: var(--gutter-height);
    }
  }
</style>