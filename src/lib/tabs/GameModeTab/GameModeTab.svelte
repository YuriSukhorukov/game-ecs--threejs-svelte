<script lang="ts">
  import styles from './styles.module.scss'

  export let title;
  export let onClick: () => void
  export let selected: boolean
</script>

<button class={`${styles.container} ${selected === true ? styles.selected : ''}`} on:click={onClick}>
  {title}
</button>