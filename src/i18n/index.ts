import { useCallback } from 'react';
import { useDemo } from '../store';
import { strings, type StringKey } from './strings';

export type Vars = Record<string, string | number>;

const fill = (s: string, vars?: Vars) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s);

/** t(key, vars) for job seeker + landing copy. Falls back to the key itself. */
export function useT() {
  const lang = useDemo((s) => s.lang);
  return useCallback(
    (key: StringKey | (string & {}), vars?: Vars) => {
      const pair = (strings as Record<string, readonly [string, string]>)[key];
      if (!pair) return fill(key, vars);
      return fill(lang === 'fil' ? pair[0] : pair[1], vars);
    },
    [lang],
  );
}

export const FIL_ORDINALS = ['unang', 'ikalawang', 'ikatlong', 'ikaapat na', 'ikalimang', 'ikaanim na', 'ikapitong'];
export const EN_NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
