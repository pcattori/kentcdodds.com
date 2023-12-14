import {json, redirect, type DataFunctionArgs} from '@remix-run/node'
import {getInstanceInfo} from '~/utils/cjs/litefs-js.server.js'
import {cache} from '~/utils/cache.server.ts'
import {getRequiredServerEnvVar} from '~/utils/misc.tsx'

export async function action({request}: DataFunctionArgs) {
  const {currentIsPrimary, primaryInstance} = await getInstanceInfo()
  if (!currentIsPrimary) {
    throw new Error(
      `${request.url} should only be called on the primary instance (${primaryInstance})}`,
    )
  }
  const token = getRequiredServerEnvVar('INTERNAL_COMMAND_TOKEN')
  const isAuthorized =
    request.headers.get('Authorization') === `Bearer ${token}`
  if (!isAuthorized) {
    console.log(
      `Unauthorized request to ${request.url}, redirecting to solid tunes 🎶`,
    )
    // rick roll them
    return redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  }
  const {key, cacheValue} = await request.json()
  if (cacheValue === undefined) {
    console.log(`Deleting ${key} from the cache from remote`)
    await cache.delete(key)
  } else {
    console.log(`Setting ${key} in the cache from remote`)
    await cache.set(key, cacheValue)
  }
  return json({success: true})
}
