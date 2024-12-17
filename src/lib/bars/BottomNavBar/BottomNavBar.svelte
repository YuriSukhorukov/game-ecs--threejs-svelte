<script lang="ts">
  import styles from './styles.module.scss'
  import { ButtonNav } from '$lib/buttons/ButtonNav';
  import pageStore, { Page } from '$stores/pageStore'
  
  const { pageState, setPage } = pageStore

  const buttonsData: Array<{title:string, icon: string, onClick: () => void}> = [
    {title: 'Game', icon: "", onClick: () => setPage(Page.GAME)},
    {title: 'Bonuses', icon: "", onClick: () => setPage(Page.BONUSES)},
    {title: 'Referrals', icon: "", onClick: () => setPage(Page.REFERRALS)},
    {title: 'Finance', icon: "", onClick: () => setPage(Page.FINANCE)},
  ]
</script>

<div class={styles.container}>
  <ul>
    {#each buttonsData as item}
    <li>
      <ButtonNav {...item}/>
    </li>
    {/each}
  </ul>
</div>