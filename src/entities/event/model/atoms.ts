import { atom } from "jotai";
import type { Event } from "../types";

export const eventsAtom = atom<Event[]>([]);

export const isLoadingAtom = atom<boolean>(true);
