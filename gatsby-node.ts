import { CreatePagesArgs } from 'gatsby'
import { NotionAPI } from 'notion-client'
import { Block, CollectionInstance, CollectionPropertySchemaMap, Decoration, PageBlock } from 'notion-types'

interface CollectionData {
  id: string
  viewId: string
  schema: CollectionPropertySchemaMap
  data: CollectionInstance
}

const getCollectionData = async (notion: NotionAPI, pageId: string): Promise<CollectionData | null> => {
  try {
    const page = await notion.getPage(pageId)

    const collections = Object.values(page.collection)
    const collectionViews = Object.values(page.collection_view)

    if (collections.length === 0 || collectionViews.length === 0) {
      throw new Error('Collection is empty')
    }

    const collection = collections[0].value
    const collectionView = collectionViews[0].value
    const collectionSchema = collection.schema

    const collectionId = collection.id
    const collectionViewId = collectionView.id
    const collectionData = await notion.getCollectionData(collectionId, collectionViewId)
    return {
      id: collectionId,
      viewId: collectionViewId,
      schema: collectionSchema,
      data: collectionData,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

const getBlocksFromCollectionData = (collectionData: CollectionInstance): Block[] => {
  return Object.values(collectionData.recordMap.block).map((i) => i.value)
}

const getPageBlocksFromBlocks = (blocks: Block[], collectionId: string): PageBlock[] =>
  blocks
    .filter((block) => block.type === 'page' && block.parent_id === collectionId && block.parent_table === 'collection')
    .map((block) => block as PageBlock)

interface Post {
  id: string
  title: string
  author: string
  visible: string
  tags: string[]
  status: string
  contents: string[]
  properties: {
    [key: string]: Decoration[]
  }
  createdAt: Date
  updatedAt: Date
}

const buildPostFromPageBlock = (schema: { [k: string]: string }) => (pageBlock: PageBlock): Post => {
  const properties = Object.fromEntries(
    Object.entries(pageBlock.properties || {}).map((property) => {
      const id = property[0]
      const name = schema[id].toLowerCase()
      const value = property[1]
      return [name, value]
    }),
  )

  return {
    id: pageBlock.id,
    title: properties['title'][0][0],
    author: properties['author'][0][0],
    visible: properties['visible'][0][0],
    tags: properties['tags'][0][0].split(','),
    status: properties['status'][0][0],
    contents: pageBlock.content || [],
    properties: properties,
    createdAt: new Date(pageBlock.created_time),
    updatedAt: new Date(pageBlock.last_edited_time),
  }
}

export const createPages = async ({}: CreatePagesArgs) => {
  const authToken = `4d5f4face389bf5ef197ff7fa148dc721c0b3e0ab760a45ec5df733889ef5b36aa8f5d9f20f3f195e00595fd8f9aaf530a7484aac6c7ed5d5bcf30475229eef80c8d7c09f5ce5980a93f52c8a7e4`
  const notion = new NotionAPI({
    authToken,
  })
  const pageId = '21fc8923-165e-4b4c-b7f3-5e2c99d8d133'
  const collectionData = await getCollectionData(notion, pageId)

  if (collectionData !== null) {
    const blocks = getBlocksFromCollectionData(collectionData.data)
    const pageBlocks = getPageBlocksFromBlocks(blocks, collectionData.id)
    const schema = Object.fromEntries(Object.entries(collectionData.schema).map((item) => [item[0], item[1].name]))

    const postBuilder = buildPostFromPageBlock(schema)
    const posts = pageBlocks.map(postBuilder)
    console.log(posts)
  }
}
