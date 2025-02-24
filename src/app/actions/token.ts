'use server'

import { env } from '@/config'

export const generateToken = async (room: string, peer: string): Promise<string> => {
  const rawResponse = await fetch(env.GATEWAYS[0] + '/token/webrtc', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + env.APP_SECRET,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ room, peer, ttl: 7200 }),
    cache: 'no-cache',
  })
  if (rawResponse.status == 200) {
    const content = await rawResponse.json()
    if (content.data?.token) {
      return content.data.token
    } else {
      throw new Error(content.error_code)
    }
  } else {
    throw new Error(rawResponse.statusText)
  }
}

export const generateRandomToken = async () => {
  const now = new Date().getTime()
  const room = 'room-' + now
  const peer = 'peer-' + now
  return [room, peer, await generateToken(room, peer)]
}
