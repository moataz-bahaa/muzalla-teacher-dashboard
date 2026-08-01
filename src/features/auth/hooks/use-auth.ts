import {
  checkHasAuthToken,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/cookie'
import { client } from '@/lib/data/client'
import { useMutation } from '@/hooks/use-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

const authorizationAtom = atom(checkHasAuthToken())

export default function useAuth() {
  const [isAuthorized, setAuthorized] = useAtom(authorizationAtom)
  const queryClient = useQueryClient()

  const logout = useMutation({
    mutationFn: () =>
      client.auth.logout({
        refreshToken: getRefreshToken(),
      }),
  })

  const broadcastLogout = () => {
    try {
      const channel = new BroadcastChannel('session')
      channel.postMessage('logout')
      channel.close()
    } catch (error) {
      console.error('BroadcastChannel error:', error)
    }
  }

  const clearSession = () => {
    setAuthorized(false)
    clearAuthTokens()
    queryClient.clear()
  }

  useEffect(() => {
    let channel: BroadcastChannel | undefined
    try {
      channel = new BroadcastChannel('session')
      channel.onmessage = (event) => {
        if (event.data === 'logout') {
          clearSession()
        }
      }
    } catch {
      // BroadcastChannel unsupported
    }

    return () => channel?.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    setToken: setAccessToken,
    getToken: getAccessToken,
    isAuthorized,
    authorize(accessToken: string, refreshToken: string) {
      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setAuthorized(true)
    },
    unauthorize(cb?: () => void) {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        logout.mutate(undefined, {
          onSuccess() {
            clearSession()
            broadcastLogout()
            cb?.()
          },
          onError() {
            clearSession()
            broadcastLogout()
            cb?.()
          },
        })
      } else {
        clearSession()
        cb?.()
      }
    },
    isLoggingOut: logout.isPending,
  }
}
