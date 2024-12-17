<script>
  import { Line } from 'svelte-chartjs'
  import { data } from './data.js';
  import {
    Chart as ChartJS,
    // Title,
    // Tooltip,
    // Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
  } from 'chart.js';
  ChartJS.register(
    // Title,
    // Tooltip,
    // Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
  );
</script>

<div class="container">
  <!-- <h1>
    ReferralsScreen
  </h1>
  <button class="button button--primary">button primary</button>
  <button class="button button--delete">button delete</button> -->
  <!-- 
  
  
  
  
  -->
  <header class="header">
    <h1 class="header__title">Refer users and earn 50%</h1>
  </header>
  <section class="invite">
    <div class="invite__header">
      <h2 class="invite__title">Invite friend:</h2>
    </div>
    <button class="invite__button">Invite</button>
  </section>
  <section class="share">
    <div class="share__header">
      <h2 class="share__title">Or share a link:</h2>
    </div>
    <div class="share__body">
      <div class="share__link">https://...</div>
      <button class="share__link-copy-button">COPY</button>
    </div>
  </section>
  <section class="statistic">
    {#each [
      {title: "Signups", value: '1'}, 
      {title: "Net New deposit", value: '1'},
      {title: "Unique Clicks", value: '1'},
      {title: "Total earnings", value: '1'},
    ] as {title, value}}
      <div class="statistic__item">
        <div class="statistic__title">{title}</div>
        <div class="statistic__value">{value}</div>
      </div>
    {/each}
  </section>
  <section class="chart">
    <Line {data} options={{ responsive: true }} />
  </section>
  <div>{import.meta.env.VITE_BASE_URL}</div>
  <!-- <section class="referrals-table"></section> -->
</div>

<style lang="scss">
  .header {
    &__title {
      margin: 0;
      padding: 0;
      font-size: 2rem;
      text-align: center;
    }
  }
  .statistic {
    margin-top: calc(2 * var(--gutter-height));
    border: 1px solid white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--gutter-height);
    min-height: calc(15 * var(--gutter-height));
    &__item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid red;
    }
    &__title {
      font-size: 1rem;
    }
    &__value {
      font-size: 2rem;
    }
  }
  .invite {
    border: 1px solid white;
    margin-top: calc(2 * var(--gutter-height));
    &__header {}
    &__title {}
    &__button {
      width: 100%;
      height: calc(5 * var(--gutter-height));
    }
  }
  .share {
    margin-top: calc(2 * var(--gutter-height));
    border: 1px solid white;
    &__header {
      width: 100%;
    }
    &__body {
      display: flex;
      width: 100%;
      border: 1px solid white;
    }
    &__link {
      width: 100%;
      border: 1px solid red;
      display: flex;
      align-items: center;
    }
    &__link-copy-button {
      padding: 0;
      box-sizing: border-box;
      width: calc(16 * var(--gutter-height));
      height: calc(5 * var(--gutter-height));
    }
  }
  .chart {
    border: 1px solid white;
    width: 100%;
    margin-top: calc(2 * var(--gutter-height));
  }
  // 
  // 
  // 
  // .block__element--modifier {
  //   // block - самостоятельная сущность (кнопка, форма, меню и т.д.)
  //   // element - часть блока имеющая смысл только в контексте этого блока
  //   // модификатор - флаг, который изменяет внешний вид или поведение блока или элемента
  //   border: 1px solid red;
  // }

  // .button {
  //   border: 1px solid red;
  //   &--primary {
  //     background-color: rgb(92, 92, 254);
  //   }
  //   &--delete {
  //     background-color: rgb(254, 92, 92);
  //   }
  // }
</style>