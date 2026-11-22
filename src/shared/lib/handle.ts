import { t } from '@contracts/i18n';

const ru: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

export function nickFromName(name: string) {
  const first = name.trim().split(/\s+/)[0] ?? '';
  const latin = [...first]
    .map((char) => {
      const lower = char.toLowerCase();
      if (ru[lower] != null) return ru[lower];
      if (/[a-z0-9]/.test(lower)) return lower;
      return '';
    })
    .join('');
  return latin || 'user';
}

export function formatHandleLevel(handle: string, level = 1) {
  return t.common.handleLevel(handle, level);
}
