import {json} from '@remix-run/node'
import {
  cache,
  isRefreshShaInfo,
  commitShaKey as refreshCacheCommitShaKey,
  type RefreshShaInfo,
} from '~/utils/cache.server.ts'

export async function loader() {
  const result = await cache.get(refreshCacheCommitShaKey)
  if (!result) {
    return json(null)
  }

  let value: RefreshShaInfo
  try {
    value = JSON.parse(result.value as any)
    if (!isRefreshShaInfo(value)) {
      throw new Error(`Invalid value: ${result.value}`)
    }
  } catch (error: unknown) {
    console.error(`Error parsing commit sha from cache: ${error}`)
    cache.delete(refreshCacheCommitShaKey)
    return json(null)
  }

  return json(value)
}
