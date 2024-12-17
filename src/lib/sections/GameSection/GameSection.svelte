<script lang="ts">
  import { GameTile } from '$lib/game/GameTile'
  import { gameHistoryState } from '$stores/gameHistoryStore'
  import { gameState } from '$stores/gameStore'
  import { gameSettingsState } from '$stores/gameSettingsStore';
  import { roundState } from '$stores/roundStore'
  import { PLACE_STATUS, placeApi, placeState } from '$stores/placeStore'
  import { playerState } from '$stores/playerStore'
  import { historyState } from '$stores/historyStore'
  import { afterUpdate, onMount } from 'svelte'
  import { balanceSet, walletGet } from '$stores/walletStore'

  let gameTilesData: Array<{index: number, status: PLACE_STATUS, onClick: (index: number) => void}> = []

  let gameHistoryData: Array<number> = []
  $: gameHistoryData = $historyState && $historyState[$gameState.bombsAmount]?.length 
                        ? [...$historyState[$gameState.bombsAmount]] 
                        : []

  let placesAmount = null
  $: placesAmount = Object.keys($placeState?.places)?.length
  let historyItemRefs = []

  $: historyItemRefs[placesAmount ?? 0]?.scrollIntoView({behavior: "smooth"})

  afterUpdate(()=>{
    historyItemRefs[placesAmount - 1]?.scrollIntoView({behavior: "smooth"})
  })

  $: if (Object.keys($placeState.places)?.length === 1) {
    walletGet({id: $playerState.id})
  }

  gameSettingsState.subscribe((state)=>{
    gameTilesData = Array(state.deskSize).fill(null).map((item, index)=>{
      return {
        index: index,
        status: PLACE_STATUS.HIDDEN,
        onClick: (index: number)=>{
          placeApi.place.create({
            playerId: $playerState.id,
            roundId: $roundState.id,
            index: index,
          })
        }
      }
    })
  })
</script>

<div class="game-history">
  <div class="game-history__container">
    {#each gameHistoryData as item, index}
      <div 
        class={`game-history__item ${index == placesAmount - 1 ? 'game-history__item--selected' : ''}`}
        bind:this={historyItemRefs[index]}
      >
        <span>x{item}</span>
      </div>
    {/each}
  </div>
</div>
<div class="container">
  <div class="game-grid">
    {#each gameTilesData as item}
      <div class="game-grid__item">
        <GameTile 
          onClick={item?.onClick} 
          index={item?.index} 
          disabled={$roundState?.active === null} 
          status={$placeState.places[item?.index]?.status} 
        />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .game-history {
    border: 1px solid blue;
    display: flex;
    justify-content: center;
    &__container {
      border: 1px solid grey;
      display: flex;
      overflow: scroll;
      gap: var(--gutter-height);
      width: calc(100% - 2 * var(--gutter-width));
      margin-top: var(--gutter-height);
      padding: calc(0.5 * var(--gutter-height));
      border-radius: var(--gutter-height);
    }
    &__item {
      border: 1px solid yellow;
      height: calc(2 * var(--gutter-width));
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: calc(0.5 * var(--gutter-height));
      padding: 0 calc(0.5 * var(--gutter-height));
      min-width: calc(7 * var(--gutter-height));
      font-size: 0.75rem;

      &--selected {
        background-color: red;
      }
    }
  }

  .container {
    border: 1px solid blue;
    box-sizing: border-box;
    display: inline-block;

    // padding: var(--gutter-height) calc(2 * var(--gutter-height));
    padding: 0 calc(2 * var(--gutter-height));
  }
  .game-grid {
    height: 100%;
    aspect-ratio: 1 / 1;

    display: inline-block;
    // border: 1px solid yellow;
    display: grid;
    gap: var(--gutter-height);
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);

    grid-auto-rows: minmax(30px, auto);

    &__item {
      box-sizing: border-box;
    }
  }
</style>