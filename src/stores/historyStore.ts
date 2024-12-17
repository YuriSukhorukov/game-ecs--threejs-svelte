import { writable } from "svelte/store";

interface HistoryState {
  [key: number]: Array<number>;
}

const initHistoryState: HistoryState = {};

export const historyState = writable(initHistoryState);

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const historyApi = {
  get: async () => {
    try {
      const json = await (
        await fetch(`${BASE_URL}/info`, {
          method: "GET",
        })
      )?.json();

      !json?.error &&
        historyState.update(() => ({
          ...json?.items,
        }));

      console.log(json);
      return json;
    } catch (e) {
      console.log(e);
    }
  },
};
