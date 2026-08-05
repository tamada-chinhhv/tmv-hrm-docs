import React from 'react';
import {Redirect, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {normalizePathname} from '@site/src/utils/localePath';

/** Redirect stacked locale prefixes to a canonical path. */
export default function Root({children}) {
  const location = useLocation();
  const {
    i18n: {defaultLocale, locales},
  } = useDocusaurusContext();

  const normalized = normalizePathname(
    location.pathname,
    defaultLocale,
    locales,
  );

  if (normalized !== location.pathname) {
    return (
      <Redirect to={`${normalized}${location.search}${location.hash}`} />
    );
  }

  return children;
}
