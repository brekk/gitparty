import { reduce, keys, pipe } from 'f-utility'
import { sortByDateObject, sortByAuthorDate } from './utils'

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    sortByDateObject,
    reduce(
      (list, key) =>
        list.concat(
          { date: key, type: `banner` },
          sortByAuthorDate(grouped[key])
        ),
      []
    )
  )(grouped)

/* eslint-disable */
export const collapseSuccessiveSameAuthor = x => {
  const y = [];
  let prev = false;
  let lastIndex = false;
  for (let i = 0; i < x.length; i++) {
    let curr = x[i];
    if (i > 0 && lastIndex && prev && curr && prev.author === curr.author) {
      y[y.length - 1] = merge(prev, {
        subject: `[+] ` + prev.subject + ` && ` + curr.subject,
        changes: merge(prev.changes, curr.changes),
        analysis: {
          style: prev.analysis.style || curr.analysis.style,
          tests: prev.analysis.tests || curr.analysis.tests,
          frontend: prev.analysis.frontend || curr.analysis.frontend,
          backend: prev.analysis.backend || curr.analysis.backend,
          assets: prev.analysis.assets || curr.analysis.assets,
          devops: prev.analysis.devops || curr.analysis.devops
        }
      });
    } else {
      y.push(curr);
    }
    prev = curr;
    lastIndex = i;
  }
  return y;
};
/* eslint-enable */
