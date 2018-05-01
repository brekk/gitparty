import { curry, reduce, assign, keys } from 'f-utility'

export const groupBy = curry((key, arr) =>
  reduce(
    (agg, raw) => {
      const copy = assign({}, agg)
      const { [key]: grouping } = raw
      copy[grouping] = (copy[grouping] || []).concat(raw) // eslint-disable-line fp/no-mutation
      return copy
    },
    {},
    arr
  )
)

export const collapseSuccessiveSameAuthor = (x) => {
  const y = []
  let prev = false
  let lastIndex = false
  for (let i = 0; i < x.length; i++) {
    let curr = x[i]
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
      })
    } else {
      y.push(curr)
    }
    prev = curr
    lastIndex = i
  }
  return y
}

const getNumber = (x) => Number(x.substr(0, x.indexOf(` `)))

export const createBannersFromGroups = (grouped) =>
  pipe(
    keys,
    // eslint-disable-next-line fp/no-mutating-methods
    (k) => k.sort((a, b) => getNumber(a) - getNumber(b)),
    reduce((list, key) => {
      const group = grouped[key]
      return list.concat({ date: key, type: `banner` }, group)
    }, [])
  )(grouped)
