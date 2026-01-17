import { getContent } from '@/lib/content-fetcher'
import HomeClient from './HomeClient'

export const revalidate = 60 // Revalidate every 60 seconds (caching enabled)

export default async function Home() {
  const content = await getContent()

  return <HomeClient initialContent={content} />
}
