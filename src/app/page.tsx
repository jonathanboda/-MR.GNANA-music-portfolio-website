import { getContent } from '@/lib/content-fetcher'
import HomeClient from './HomeClient'

export const revalidate = 0 // No caching - always fetch fresh data

export default async function Home() {
  const content = await getContent()

  return <HomeClient initialContent={content} />
}
