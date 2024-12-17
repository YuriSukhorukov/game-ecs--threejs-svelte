<script lang="ts">
  import styles from './styles.module.scss'
  
  // let inputField;
  export let fieldValue = null;
  export let maxValue = null;
  export let disabled: boolean | null = false

  export let onChange: (value: number) => void = (value) => {}

  $: onChange(parseFloat(fieldValue))
</script>
<div class={styles.container}>
  <input disabled={disabled} type=text placeholder="Enter bet" bind:value={fieldValue} on:input={(e)=>{
    if (!e?.target?.value) return
    fieldValue = e.target.value.replace(/[^0-9.]/g, '')
  }}>
</div>