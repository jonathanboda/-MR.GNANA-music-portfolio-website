'use client'

import { createContext, useContext, ReactNode } from 'react'
import { siteContent as staticContent } from '@/data/content'
import type { SiteContentType } from './content-fetcher'

interface ContentContextType {
  content: SiteContentType
}

const ContentContext = createContext<ContentContextType>({
  content: staticContent as SiteContentType
})

export function ContentProvider({
  children,
  initialContent
}: {
  children: ReactNode
  initialContent?: Partial<SiteContentType>
}) {
  const content = {
    ...staticContent,
    ...initialContent
  } as SiteContentType

  return (
    <ContentContext.Provider value={{ content }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext)
