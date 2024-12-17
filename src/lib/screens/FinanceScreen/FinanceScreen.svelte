<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { 
    type WalletsModalState,
    TonConnectUI, 
  } from '@tonconnect/ui'
  // import { TonConnect } from '@tonconnect/sdk';

  
  // tonConnectUI.uiOptions = {
  //   language: 'ru',
  //   uiPreferences: {
  //       theme: THEME.DARK
  //   }
  // };
  // const tonConnect = new TonConnect({
  //   chain: 'mainnet',
  //   manifestUrl: 'https://example.com/tonconnect-manifest.json',
  //   // restoreConnection: true,
  // });
  
  export let displayed = false
  let unsubscribeModal = null
  let modal = null

  let currentWallet = null
  let currentWalletInfo = null
  let currentAccount = null
  let currentIsConnectedStatus = null
  
  onMount(async ()=>{
    // const walletsList = await tonConnect.getWallets();
    
    const tonConnectUI = new TonConnectUI({
      // chain: "devnet",
      // manifestUrl: '../../../../tonconnect-manifest.json',
      manifestUrl: 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json',
      buttonRootId: 'wallet_connect'
    });
    
    const walletsList = await tonConnectUI.getWallets()
    console.log(walletsList)

    modal = tonConnectUI?.modal

    // await tonConnectUI.openSingleWalletModal('telegram-wallet"');

    const currentWallet = tonConnectUI.wallet;
    const currentWalletInfo = tonConnectUI.walletInfo;
    const currentAccount = tonConnectUI.account;
    const currentIsConnectedStatus = tonConnectUI.connected;

    window.addEventListener("connection-completed", (e) => {
      console.log(`wallet connected: ${e}`)
    })

    unsubscribeModal = tonConnectUI.onModalStateChange(
      (state: WalletsModalState) => {
        console.log(state)
      }
    );
  })

  onDestroy(()=>{
    unsubscribeModal && unsubscribeModal()
  })

  // async function openModal(e) {
  //   e.preventDefault()
  //   await modal.open()
  // }
</script>

<div class={`${displayed ? "displayed" : "hidden"} finance__container`}>
  <h1>FinanceScreen</h1>
  <div class="finance__wallet-connect-btn" id="wallet_connect"></div>
</div>

<style lang="scss">
  .hidden {
    display: none;
  }
  .displayed {
    display: block;
  }

  .finance {
    &__container {
      border: 1px solid red;
    }
    &__wallet-connect-btn {
      background-color: transparent;
    }
  }
</style>