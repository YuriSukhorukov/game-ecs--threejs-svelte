<script lang="ts">
  import styles from './styles.module.scss'
  import { Button } from '$lib/buttons/Button';
  import { gameSettingsGet, gameSettingsState } from '$stores/gameSettingsStore'
  import { addBombsAmount, gameState, setBombsAmount, subBombsAmount } from '$stores/gameStore'
  import { onMount } from 'svelte'
  import { roundState } from '$stores/roundStore'

  let gameSettingsButtonsDataLeft: Array<{bombsAmount: number, onSelect: () => void}> = []
  let gameSettingsButtonsDataRight: Array<{bombsAmount: number, onSelect: () => void}> = []

  let bombsAmounts = [3, 5, 10, 20]

  $: gameSettingsButtonsDataLeft = bombsAmounts.splice(0, bombsAmounts.length / 2).map((item: number) => ({bombsAmount: item, onSelect: ()=>setBombsAmount({amount: item})}))
  $: gameSettingsButtonsDataRight = bombsAmounts.map((item: number)=>({bombsAmount: item, onSelect: () => setBombsAmount({amount: item})}))

  $: $roundState?.active === true && setBombsAmount({amount: Number($roundState.bombsAmount)})

  onMount(async ()=>{ 
    await gameSettingsGet()
    setBombsAmount({amount: $gameSettingsState.bombsAmountDefault})
  })

  function onAddBombsAmount() {
    addBombsAmount({step: $gameSettingsState.bombsAmountChangeStep, max: $gameSettingsState.bombsAmountMax})
  }
  function onSubBombsAmount() {
    subBombsAmount({step: $gameSettingsState.bombsAmountChangeStep, min: $gameSettingsState.bombsAmountMin})
  }

  let height = 5;

  let disabledInput = false
  $: disabledInput = $roundState?.active
</script>

<div class="container">
  {#each gameSettingsButtonsDataLeft as item}
    <div class="button">
      <Button {height} onClick={item.onSelect} disabled={disabledInput}>{item.bombsAmount}</Button>
    </div>
  {/each}
  <div class="game_settings">
    <div class="game_settings__button">
      <Button {height} onClick={onSubBombsAmount} disabled={disabledInput}>-</Button>
    </div>
    <div class="game_settings__info">
      <div class="game_settings__info__label">Bombs:</div>
      <div class="game_settings__info__value">{$gameState.bombsAmount}</div>
    </div>
    <div class="game_settings__button">
      <Button {height} onClick={onAddBombsAmount} disabled={disabledInput}>+</Button>
    </div>
  </div>
  {#each gameSettingsButtonsDataRight as item}
    <div class="button">
      <Button {height} onClick={item.onSelect} disabled={disabledInput}>{item.bombsAmount}</Button>
    </div>
  {/each}
</div>

<style lang="scss">
  .container {
    border: 1px solid red;
    display: flex;
    gap: var(--gutter-height);
  }
  .button {
    flex: 1.45;
  }
  
  .game_settings {
    display: flex;
    flex: 4;
    &__info {
      flex: 0.9;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0 0.25rem;
      &__label {
        font-size: 0.8rem;
      }
      &__value {
        font-size: 1.2rem;
      }
    }
    &__button {
      flex: 1.1;
      width: 100%;
    }
  }
</style>