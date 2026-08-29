import React, {useEffect} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {normalizePathname} from '@site/src/utils/localePath';

/** Redirect stacked locale prefixes to a canonical path. */
export default function Root({children}) {
  const location = useLocation();
  const history = useHistory();
  const {
    i18n: {defaultLocale, locales},
  } = useDocusaurusContext();

  const normalized = normalizePathname(
    location.pathname,
    defaultLocale,
    locales,
  );

  useEffect(() => {
    if (normalized !== location.pathname) {
      history.replace(`${normalized}${location.search}${location.hash}`);
    }
  }, [history, location.hash, location.pathname, location.search, normalized]);

  return <>{children}</>;
}
