<script lang="ts">
  import { PLACE_STATUS } from "$stores/placeStore"

  export let disabled: boolean = true
  export let index: number | null = null
  export let onClick: (index: number) => void
  export let status: PLACE_STATUS = null
</script>

<div class="container" >
  <button on:click={()=>{onClick(index)}} class="game-tile__button" disabled={disabled}>
    {#if status === PLACE_STATUS.HIDDEN}
      <div>Game Tile</div>
    {:else if status === PLACE_STATUS.ITEM}
      <div>💎</div>
    {:else if status === PLACE_STATUS.BOMB}
      <div>💣</div>
    {/if}
  </button>
</div>

<style lang="scss">
  .container {
    border: 1px solid red;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
    width: 100%;
    border-radius: var(--gutter-height);
  }

  .game-tile {
    &__button {
      width: 100%;
      height: 100%;
      border-radius: var(--gutter-height);
    }
  }
</style>