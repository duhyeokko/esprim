import { ReplaceComponentRendererArgs } from 'gatsby'
import React from 'react'
import { BlockMapType, NotionRenderer } from 'react-notion'
import { Post } from '../source/notion/post'

interface PostTemplateProps extends ReplaceComponentRendererArgs {
  pageContext: Post
}

const PostTemplate: React.FC<PostTemplateProps> = ({ pageContext }) => (
  <main>
    <NotionRenderer blockMap={pageContext.rawPage.block as BlockMapType} />
  </main>
)

export default PostTemplate
