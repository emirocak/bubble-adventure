import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'bubble-pieces-v1';
const SEEN_INTRO_KEY = 'bubble-seen-intro-v1';

export type PieceId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export const ALL_PIECES: PieceId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function readPieces(): Set<PieceId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(
      arr.filter(
        (n): n is PieceId =>
          typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 9,
      ),
    );
  } catch {
    return new Set();
  }
}

function writePieces(pieces: Set<PieceId>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...pieces].sort()));
}

function cleanUrlParam(key: string) {
  const url = new URL(window.location.href);
  if (url.searchParams.has(key)) {
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url.toString());
  }
}

export function usePuzzleState() {
  const [pieces, setPieces] = useState<Set<PieceId>>(() => readPieces());
  const [seenIntro, setSeenIntro] = useState<boolean>(
    () => localStorage.getItem(SEEN_INTRO_KEY) === '1',
  );
  const [justUnlocked, setJustUnlocked] = useState<PieceId | null>(null);
  const [alreadyHad, setAlreadyHad] = useState<PieceId | null>(null);

  // On mount: handle ?p=N and ?reset=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('reset') === '1') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SEEN_INTRO_KEY);
      cleanUrlParam('reset');
      setPieces(new Set());
      setSeenIntro(false);
      return;
    }

    const p = params.get('p');
    if (p) {
      const n = parseInt(p, 10);
      if (Number.isInteger(n) && n >= 1 && n <= 9) {
        const pieceId = n as PieceId;
        const current = readPieces();
        if (current.has(pieceId)) {
          setAlreadyHad(pieceId);
        } else {
          current.add(pieceId);
          writePieces(current);
          setPieces(new Set(current));
          // Small delay so the reveal animation feels intentional
          setTimeout(() => setJustUnlocked(pieceId), 400);
        }
      }
      cleanUrlParam('p');
    }
  }, []);

  const markIntroSeen = useCallback(() => {
    localStorage.setItem(SEEN_INTRO_KEY, '1');
    setSeenIntro(true);
  }, []);

  const clearJustUnlocked = useCallback(() => setJustUnlocked(null), []);
  const clearAlreadyHad = useCallback(() => setAlreadyHad(null), []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SEEN_INTRO_KEY);
    setPieces(new Set());
    setSeenIntro(false);
    setJustUnlocked(null);
    setAlreadyHad(null);
  }, []);

  return {
    pieces,
    isComplete: pieces.size === 9,
    seenIntro,
    markIntroSeen,
    justUnlocked,
    clearJustUnlocked,
    alreadyHad,
    clearAlreadyHad,
    reset,
  };
}
