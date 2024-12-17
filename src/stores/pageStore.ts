import { writable } from "svelte/store";

export enum Page {
  GAME = "GAME",
  BONUSES = "BONUSES",
  REFERRALS = "REFERRALS",
  FINANCE = "FINANCE",
}

const initPageState = Page.GAME;

const pageState = writable(initPageState);

const setPage = (page) => {
  pageState.set(page);
};

export default {
  pageState,
  setPage,
};
