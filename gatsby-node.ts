import 'dotenv/config'
import { Actions, CreatePagesArgs } from 'gatsby'
import { NotionAPI } from 'notion-client'
import { PageBlock } from 'notion-types'
import { resolve } from 'path'
import * as R from 'ramda'
import { getPageBlocksFromCollection } from './src/source/notion/block'
import { getCollection } from './src/source/notion/collection'
import { buildPostFromPageBlock } from './src/source/notion/post'
import { getSchemaFromCollection } from './src/source/notion/schema'

export const createPages = async ({ actions }: CreatePagesArgs) => {
  await createPagesFromNotion(actions)
}

async function createPagesFromNotion(actions: Actions) {
  const { createPage } = actions
  const authToken = process.env.TOKEN
  const notion = new NotionAPI({
    authToken,
  })
  const pageId = process.env.PAGE_ID || ''

  if (R.isEmpty(pageId)) {
    console.warn('Page id must not be empty')
    return
  }

  const collection = await getCollection(notion, pageId)

  if (collection === null) {
    console.error('Empty collection is not allowed')
    return
  }

  const pageBlocks = getPageBlocksFromCollection(collection)
  const schema = getSchemaFromCollection(collection)

  const postPromises = R.map((pageBlock: PageBlock) => buildPostFromPageBlock(notion, schema, pageBlock))(pageBlocks)
  const posts = await Promise.all(postPromises)

  posts.forEach((post) => {
    if (!post.visible) {
      return
    }

    createPage({
      path: post.id.toString().replace('-', ''),
      context: post,
      component: resolve(__dirname, './src/templates/post_template.tsx'),
    })
  })
}
