import { writable } from "svelte/store";

interface PlayerState {
  id: string | null;
  username: string | null;
}

const initPlayerState: PlayerState = {
  id: null,
  username: null,
};

export enum ERROR {
  NOT_FOUND = "record not found",
}

export const playerState = writable(initPlayerState);

// export const BASE_URL = `${import.meta.env.VITE_BASE_URL}/players/myself`
export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const playerGet = async ({ id }: { id: string }) => {
  try {
    const result = await fetch(`${BASE_URL}/players/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await result?.json();

    !json.error &&
      playerState.update(() => ({
        ...json.results[0],
      }));

    return json;
  } catch (e) {
    console.log(e);
  }
};

export const playerCreate = async (data: { id: string; username: string }) => {
  try {
    const result = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json = await result.json();

    !json.error &&
      playerState.update(() => ({
        ...json.results[0],
      }));

    return json;
  } catch (e) {
    console.log(e);
  }
};

// Отправляем гет запрос на полуение пользователя
// На беке смотрим есть ли токен
// Если токена нет, то создаем токен, создаем пользщователя, устанавливаем httponly куки
// передаем пользователю
