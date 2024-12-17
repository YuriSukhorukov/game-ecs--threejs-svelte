import { writable } from "svelte/store";

enum CURRENCY {
  TON = "TON",
  USDT = "USDT",
}

interface Balance {
  id: string;
  currency: CURRENCY;
  amount: string;
}

interface WalletStore {
  balances: Array<Balance | null>;
  balance: Balance | null;
}

const initWalletStore: WalletStore = {
  balances: [],
  balance: null,
};

export const walletState = writable(initWalletStore);

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const walletGet = async ({ id }: { id: string }) => {
  try {
    const result = await fetch(`${BASE_URL}/players/${id}/balances`);
    const json = await result.json();

    !json.error &&
      walletState.update((state) => ({
        ...state,
        balances: json.results.map((item) => ({
          id: item?.id,
          currency: item?.currency,
          amount: item?.amount,
        })),
      }));

    balanceSet(json.results[0]);

    return json;
  } catch (e) {
    console.log(e);
  }
};

export const balanceSet = (balance: Balance | null) => {
  walletState.update((state) => ({
    ...state,
    balance: balance,
  }));
};
