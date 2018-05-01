import { curry, reduce, assign, keys, pipe } from 'f-utility'

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

export const collapseSuccessiveSameAuthor = (list) => {
  if (list.length <= 1) {
    return list
  }
  return reduce((agg, curr) => {
    const copy = [].concat(agg)
    if (agg.length > 1) {
      console.log(`>>>`, curr, `<<<<`, prev)
      const prev = copy[agg.length - 1]
      if (prev.author === curr.author) {
        const { analysis: prior } = prev
        const { analysis: now } = curr
        const amended = merge(prev, {
          subject: `[+] ${prev.subject} && ${curr.subject}`,
          changes: merge(prev.changes, curr.changes),
          analysis: {
            style: prior.style || now.style,
            frontend: prior.frontend || now.frontend,
            backend: prior.backend || now.backend,
            assets: prior.assets || now.assets,
            devops: prior.devops || now.devops,
            tests: prior.tests || now.tests
          }
        })
        // eslint-disable-next-line fp/no-mutation
        copy[agg.length - 1] = amended
      } else {
        // eslint-disable-next-line fp/no-mutating-methods
        copy.push(curr)
      }
    }
    return copy
  }, [])
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
