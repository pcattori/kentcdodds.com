// This is a full stack component that controls showing a notification message
// which the user can dismiss for a period of time.
import {json, type DataFunctionArgs} from '@remix-run/node'
import cookie from 'cookie'
import invariant from 'tiny-invariant'

export async function action({request}: DataFunctionArgs) {
  const formData = await request.formData()
  const maxAge = Number(formData.get('maxAge')) || 60 * 60 * 24 * 7 * 2
  const promoName = formData.get('promoName')
  invariant(typeof promoName === 'string', 'promoName must be a string')

  const cookieHeader = cookie.serialize(promoName, 'hidden', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  })
  return json({success: true}, {headers: {'Set-Cookie': cookieHeader}})
}
