import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'MUZALLA_ACCESS_TOKEN'
const REFRESH_TOKEN_KEY = 'MUZALLA_REFRESH_TOKEN'

export function setAccessToken(token: string, options?: Cookies.CookieAttributes) {
  Cookies.set(ACCESS_TOKEN_KEY, token, options)
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function setRefreshToken(token: string, options?: Cookies.CookieAttributes) {
  Cookies.set(REFRESH_TOKEN_KEY, token, options)
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens() {
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)
}