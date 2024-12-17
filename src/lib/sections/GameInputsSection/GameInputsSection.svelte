<script>
  import styles from './styles.module.scss'
  import { GameInputNumber } from '$lib/inputs/GameInputNumber';
	import { Button } from '$lib/buttons/Button';
  import { gameSettingsState } from '$stores/gameSettingsStore'
  import { gameState, addBetAmount, subBetAmount, setMinBetAmount, setMaxBetAmount, setBetAmount } from '$stores/gameStore'
  import { playerState } from '$stores/playerStore'
  import { walletState } from '$stores/walletStore'
  import { roundState } from '$stores/roundStore'

  const height = 5;

  let betAmount = null;
  $: betAmount = $roundState?.active === true 
                ? $roundState.betAmount 
                : isNaN($gameState?.betAmount) 
                  ? null 
                  : $gameState?.betAmount
  let balance = null;
  $: balance = $walletState?.balance?.amount;

  let disabledInput = false
  $: disabledInput = $roundState?.active
</script>

<div class="game-input__container">
  <div class="game-input__button">
    <Button disabled={disabledInput} onClick={() => setMinBetAmount($walletState?.balance?.amount * $gameSettingsState?.betAmountMultiplierMin)} {height}>Min</Button>
  </div>
  <div class="game-input__button">
    <Button {height} disabled={disabledInput} onClick={() => subBetAmount($gameSettingsState.betAmountChangeStep)}>-</Button>
  </div>
  <div class="game-input__number">
    <GameInputNumber disabled={disabledInput} onChange={(value) => setBetAmount(isNaN(value) ? null : value < balance ? value : balance) } fieldValue={betAmount} maxValue={balance} />
  </div>
  <div class="game-input__button">
    <Button {height} disabled={disabledInput} onClick={() => addBetAmount($gameSettingsState.betAmountChangeStep)}>+</Button>
  </div>
  <div class="game-input__button">
    <Button {height} disabled={disabledInput} onClick={() => setMinBetAmount($walletState?.balance?.amount * $gameSettingsState?.betAmountMultiplierMax)}>Max</Button>
  </div>
</div>

<style lang="scss">
  .game-input {
    &__container {
      border: 1px solid red;
      display: flex;
      justify-content: space-between;
      gap: var(--gutter-height);
    }
    &__button {
      // border: 1px solid white;
      flex: 1;
      width: 100%;
      flex: 1.45;
    }
    &__number {
      // border: 1px solid red;
      flex: 4;
    }
  }
</style>