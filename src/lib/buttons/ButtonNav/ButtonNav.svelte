<script lang="ts">
  import style from './styles.module.scss'

  export let title: string;
  export let icon: string;
  // export let disabled: boolean | null = true;
  export let onClick: () => void;
</script>

<div class={style.container}>
  <button on:click={onClick}>{title} {icon}</button>
</div>