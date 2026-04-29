import { atom } from "jotai";
import type { Event } from "@/src/entities/event";

export const cryptoEventsAtom = atom<Event[]>([]);

export const cryptoSubSlugAtom = atom<string | null>(null);

export const cryptoTypeChipAtom = atom<string | null>(null);

export const cryptoCountsAtom = atom<Record<string, number>>({});

export const cryptoAllCountAtom = atom<number>(0);
