export type OpengraphMetadata = OpengraphArticle | OpengraphProfile | OpengraphWebsite

export interface OpengraphArticle {
  type: 'article'
  publishedTime: Date
  modifiedTime: Date
  expirationTime: Date
  author: string
  section: string
  tag: string[]
}

export interface OpengraphProfile {
  type: 'profile'
  firstName: string
  lastName: string
  username: string
}

export interface OpengraphWebsite {
  type: 'website'
}

export const opengraphWebsite: OpengraphWebsite = {
  type: 'website',
}
