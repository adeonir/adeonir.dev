type Release = () => void
type Bind = () => Release | undefined

const binds = new Set<Bind>()
let releases: Release[] = []
let bound = false

const runBind = (bind: Bind) => {
  const release = bind()
  if (release) releases.push(release)
}

document.addEventListener('astro:page-load', () => {
  bound = true
  for (const bind of binds) runBind(bind)
})

document.addEventListener('astro:before-swap', () => {
  bound = false
  const pending = releases
  releases = []
  for (const release of pending) {
    try {
      release()
    } catch {}
  }
})

export const onVisit = (bind: Bind) => {
  binds.add(bind)
  if (bound) runBind(bind)
}
