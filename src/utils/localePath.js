/**
 * Normalize locale-prefixed paths for i18n routing.
 * Fixes stacked prefixes like /ja/en/en/docs/intro in dev mode.
 */

/**
 * @param {string} pathname
 * @param {string} defaultLocale
 * @param {string[]} locales
 */
export function parseLocalizedPath(pathname, defaultLocale, locales) {
  const localeSet = new Set(locales);
  const segments = pathname.split('/').filter(Boolean);

  /** @type {string[]} */
  const localePrefixes = [];
  let index = 0;

  while (index < segments.length && localeSet.has(segments[index])) {
    localePrefixes.push(segments[index]);
    index += 1;
  }

  const locale =
    localePrefixes.length > 0 ? localePrefixes[0] : defaultLocale;
  const rest = segments.slice(index);
  const cleanPath = rest.length > 0 ? `/${rest.join('/')}` : '/';

  return {locale, cleanPath, hasStackedLocales: localePrefixes.length > 1};
}

/**
 * @param {string} cleanPath
 * @param {string} targetLocale
 * @param {string} defaultLocale
 */
export function buildLocalizedPath(cleanPath, targetLocale, defaultLocale) {
  const suffix = cleanPath === '/' ? '' : cleanPath;

  if (targetLocale === defaultLocale) {
    return suffix || '/';
  }

  return `/${targetLocale}${suffix}`;
}

/**
 * @param {string} pathname
 * @param {string} defaultLocale
 * @param {string[]} locales
 */
export function normalizePathname(pathname, defaultLocale, locales) {
  const {locale, cleanPath} = parseLocalizedPath(
    pathname,
    defaultLocale,
    locales,
  );
  return buildLocalizedPath(cleanPath, locale, defaultLocale);
}

/**
 * @param {string} pathname
 * @param {string} targetLocale
 * @param {string} defaultLocale
 * @param {string[]} locales
 */
export function localizePathname(
  pathname,
  targetLocale,
  defaultLocale,
  locales,
) {
  const {cleanPath} = parseLocalizedPath(pathname, defaultLocale, locales);
  return buildLocalizedPath(cleanPath, targetLocale, defaultLocale);
}
