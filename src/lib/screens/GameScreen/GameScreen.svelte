<script lang="ts">
  import styles from './styles.module.scss'
	import { GameSection } from '$lib/sections/GameSection';
	import { GameInputsSection } from '$lib/sections/GameInputsSection';
	import { GameModeSection } from '$lib/sections/GameModeSection';
  import { GameSettingsSection } from '$lib/sections/GameSettingsSection'
  import { ButtonPlaceBet } from '$lib/buttons/ButtonPlaceBet'
  import { onMount } from 'svelte'
  import { ERROR, playerCreate, playerGet, playerState } from '$stores/playerStore'
  import { balanceSet, walletGet, walletState } from '$stores/walletStore'
  import { gameState } from '$stores/gameStore'
  import { roundState, roundApi, roundStatusSet, ROUND_STATUS } from '$stores/roundStore'
  import { PLACE_STATUS, placeApi, placeState } from '$stores/placeStore'
  import { historyApi, historyState } from '$stores/historyStore'
  import { gameSettingsState } from '$stores/gameSettingsStore'

  const player = {
    id: '32',
    username: 'Sam'
  }

  onMount(async ()=>{
    await historyApi.get()
    
    let result = await playerGet({id: player.id})
    if (!!result?.error && result?.error.message === ERROR.NOT_FOUND) {
      result = await playerCreate(player)
      console.log('create', result)
    } else {
      console.log('get', result)
    }
    let {results} = result
    if (!results) return
    let playerId = null
    if (results?.length > 0) {
      playerId = results[0]?.id
    } else {
      return
    }

    await walletGet({id: $playerState.id})

    const rounds = (await roundApi.rounds.get({playerId: $playerState.id}))?.results
    if (!rounds?.length) return
    const {id: roundId} = rounds[0]

    await placeApi.place.list({playerId, roundId})
  })
  
  $: if ($walletState.balances?.length > 0 && $walletState.balance === null) {
    balanceSet($walletState.balances[0])
  }

  const onRoundStart = () => {
    if (!$gameState?.betAmount || !$gameState.bombsAmount) return

    roundApi.rounds.create({
      playerId: $playerState.id,
      balanceId: $walletState.balance.id,
      betAmount: $gameState?.betAmount?.toString(),
      bombsAmount: $gameState.bombsAmount.toString()
    })
  }
  const onRoundCancel = async () => {
    await roundApi.rounds.cancel({playerId: $playerState.id, roundId: $roundState.id})
    placeApi.place.clear()
  }
  const onRoundCashOut = async () => {
    await roundApi.rounds.cashOut({playerId: $playerState.id, roundId: $roundState.id})
    await walletGet({id: $playerState.id})
    placeApi.place.clear()
  }

  $: if (!!$placeState.reward) {
    roundStatusSet({status: ROUND_STATUS.IN_PROGRESS})
  }

  $: console.log(`balance: ${$walletState.balance?.amount}`)
  $: console.log($placeState.places)
  $: console.log(`creation index: ${$placeState.creationIndex}`)
  $: console.log(`desk size: ${$gameSettingsState.deskSize}`)
  $: console.log(`bombs amount: ${$roundState.bombsAmount}`)
  $: console.log(`--- ${Number($placeState.creationIndex) + Number($roundState.bombsAmount)}`)
  $: console.log(`// --- ${(Number($placeState.creationIndex) + Number($roundState.bombsAmount)) == Number($gameSettingsState.deskSize)}`)

  $: if ((Number($placeState.creationIndex ?? NaN) + Number($roundState.bombsAmount ?? NaN)) === Number($gameSettingsState.deskSize ?? NaN)) {
    roundStatusSet({status: ROUND_STATUS.FINISHED})
    setTimeout(()=>{
      walletGet({id: $playerState.id})
      placeApi.place.clear()
      roundApi.rounds.reset()
    }, 1000)
  }
  // $: console.log($placeState.status)
  $: if ($placeState.status === PLACE_STATUS.BOMB && $roundState.status === ROUND_STATUS.IN_PROGRESS) {
    roundStatusSet({status: ROUND_STATUS.FINISHED})
    placeApi.place.list({playerId: $playerState.id, roundId: $roundState.id})
    console.log('ROUND FAIL')
    setTimeout(()=>{
      walletGet({id: $playerState.id})
      placeApi.place.clear()
      roundApi.rounds.reset()
    }, 3000)
  }
</script>

<div class={styles.container}>
  <div class="balance">
    <span class="balance__label">Balance:</span>
    <span class="balance__amount">{$walletState.balance?.amount ?? ""}</span>
    <span class="balance__currency">{$walletState.balance?.currency ?? ""}</span>
  </div>
  <GameModeSection />
  <GameSection />
  <GameInputsSection />
  <GameSettingsSection />
  <ButtonPlaceBet 
    onStart={onRoundStart} 
    onCancel={onRoundCancel} 
    onCashOut={onRoundCashOut} 
    state={$roundState.status} 
    reward={Number($placeState.reward).toString()}
  />
</div>

<style lang="scss">
  .balance {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid green;
    border-radius: var(--gutter-height);
    gap: var(--gutter-height);

    &__label {}
    &__amount {}
    &__currency {}
  }
</style>