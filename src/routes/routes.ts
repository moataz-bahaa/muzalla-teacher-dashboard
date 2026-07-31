export const routes = {
  home: '/',
} as const

export type TRoute = (typeof routes)[keyof typeof routes]
