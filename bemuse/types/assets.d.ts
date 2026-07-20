// Ambient declarations for static asset imports.
// `import url from './foo.png'` yields the emitted URL string, both under the
// webpack asset-module rules (now) and Vite (later).

declare module '*.png' {
  const url: string
  export default url
}

declare module '*.svg' {
  const url: string
  export default url
}

declare module '*.jpg' {
  const url: string
  export default url
}

declare module '*.gif' {
  const url: string
  export default url
}

declare module '*.ogg' {
  const url: string
  export default url
}
