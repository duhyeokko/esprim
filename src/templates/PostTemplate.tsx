import { ReplaceComponentRendererArgs } from 'gatsby'
import { BlockMapType, NotionRenderer } from 'react-notion'
import { Post } from '../source/notion/post'
import { FC } from 'react'

interface PostTemplateProps extends ReplaceComponentRendererArgs {
  pageContext: Post
}

const PostTemplate: FC<PostTemplateProps> = ({ pageContext }) => (
  <main>
    <NotionRenderer blockMap={pageContext.rawPage.block as BlockMapType} />
  </main>
)

export default PostTemplate
