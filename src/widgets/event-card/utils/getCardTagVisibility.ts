const NEW_BADGE_VOLUME_THRESHOLD_USD = 10_000;

const NEW_BADGE_RECENT_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

export type CardTagVisibilityInput = {
  volume?: number | string | null;
  startDate?: string | null;
  endDate?: string | null;
  closed?: boolean | null;
  createdAt?: string | null;
};

export type CardTagVisibility = {
  showNew: boolean;
  showVol: boolean;
};

function parseVolume(volume: number | string | null | undefined): number {
  if (volume == null) return 0;
  const n = typeof volume === "number" ? volume : Number(volume);
  return Number.isFinite(n) ? n : 0;
}

export function getCardTagVisibility(input: CardTagVisibilityInput): CardTagVisibility {
  const v = parseVolume(input.volume);

  if (
    input.closed ||
    (input.endDate != null &&
      input.endDate !== "" &&
      !Number.isNaN(Date.parse(input.endDate)) &&
      Date.parse(input.endDate) < Date.now())
  ) {
    return { showNew: false, showVol: true };
  }

  const start = input.startDate ? new Date(input.startDate) : null;
  const startValid = start != null && !Number.isNaN(start.getTime());
  const now = Date.now();
  const twoDaysAgo = now - NEW_BADGE_RECENT_WINDOW_MS;

  const isRecentHighVolumeNew = (() => {
    const createdTs = input.createdAt ? Date.parse(input.createdAt) : NaN;
    if (Number.isFinite(createdTs) && createdTs <= now && twoDaysAgo < createdTs) {
      return true;
    }
    if (startValid && start != null) {
      const t = start.getTime();
      if (t <= now && twoDaysAgo < t) return true;
    }
    return false;
  })();

  if (v < NEW_BADGE_VOLUME_THRESHOLD_USD) {
    return { showNew: true, showVol: false };
  }

  return isRecentHighVolumeNew
    ? { showNew: true, showVol: true }
    : { showNew: false, showVol: true };
}
