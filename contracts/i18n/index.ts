import { ru } from './ru';

export type { PluralForms } from './types';

export type Dictionary = typeof ru;

export const dictionaries = { ru } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

export const defaultLocale: Locale = 'ru';

export const t: Dictionary = dictionaries[defaultLocale];
