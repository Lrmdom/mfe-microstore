import { useRouter } from "next/router"
import { useRef } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type UseSettings = {
  settings: Settings | undefined
  retryOnError?: boolean
  isLoading: boolean
}

export const useSettings = (): UseSettings => {
  const random = useRef(Date.now())
  const router = useRouter()
  const { accessToken } = router.query

  const { data: settings, error: apiError } = useSWR<
    Settings | { valid: false; retryOnError: boolean }
  >(
    router.isReady
      ? [`/microstore/api/settings?accessToken=${accessToken}`, random]
      : null,
    fetcher,
    { revalidateOnFocus: false }
  )
  const isLoading = !settings && !apiError
  const isInvalid = settings && !settings.valid
  const isInvalidButRetryable = isInvalid && settings.retryOnError
  const is404 = isInvalid && !isInvalidButRetryable

  // checkout is invalid and there is no reason for the user to retry
  // we take them to 404 page and remove all query string data
  if (is404) {
    router.push("/404")
  }

  // checkout is invalid, but there's a chance to retry by refreshing the page
  // eg. connectivity error
  // this means we can show the app data, yet we don't want to remove query string data
  if (isInvalidButRetryable) {
    return {
      settings: undefined,
      retryOnError: true,
      isLoading: false,
    }
  }

  if (!settings) {
    return {
      settings: undefined,
      retryOnError: false,
      isLoading: false,
    }
  }

  return {
    settings: settings as Settings,
    isLoading,
  }
}
