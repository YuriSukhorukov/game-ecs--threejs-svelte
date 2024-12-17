<script lang="ts">
	import { GameModeTab } from './../../tabs/GameModeTab';
  import { GameMode, setGameMode, gameState } from '$stores/gameStore';
  import styles from './styles.module.scss'

  const gameModesData: Array<{title: string, mode: GameMode, onClick: () => void}> = [
    {title: "Manual", mode: GameMode.MANUAL, onClick: () => setGameMode(GameMode.MANUAL)},
    {title: "Auto", mode: GameMode.AUTO, onClick: () => setGameMode(GameMode.AUTO)},
  ]

  $: mode = $gameState.mode
</script>

<div class={styles.container}>
  <div class="game_mode__tabs">
    {#each gameModesData as gameModeItem}
      <GameModeTab {...gameModeItem} selected={mode === gameModeItem.mode} />
    {/each}
  </div>
</div>

<style lang="scss">
  .game_mode {
    &__tabs {
      display: flex;
      justify-content: space-between;
      gap: var(--gutter-height);
    }
  }
</style>