import { CreatePagesArgs } from 'gatsby'
import { NotionAPI } from 'notion-client'
import {
  Block,
  CollectionInstance,
  CollectionPropertySchemaMap,
  DateFormat,
  Decoration,
  PageBlock,
  SubDecoration,
} from 'notion-types'

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
      console.error('Collection is empty')
      return null
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

const getPageBlocksFromBlocks = (blocks: Block[], collectionId: string): PageBlock[] => {
  return blocks
    .filter((block) => block.type === 'page' && block.parent_id === collectionId && block.parent_table === 'collection')
    .map((block) => block as PageBlock)
}

interface Post {
  id: string
  title: string
  author: SubDecoration | undefined
  date: string | undefined
  visible: boolean
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
    Object.entries(pageBlock.properties || {})
      .filter((property) => !!property && Object.keys(property).length > 0)
      .map((property) => {
        const id = property[0]
        const name = schema[id].toLowerCase()
        const value = property[1]
        return [name, value]
      }),
  )

  console.log(properties)

  const visible = properties['visible'] ? properties['visible'][0][0] === 'Yes' : false
  const author = properties['author'][0][1] ? properties['author'][0][1][0] : undefined
  const date = properties['date'][0][1] ? (properties['date'][0][1]![0] as DateFormat)[1]['start_date'] : undefined

  return {
    id: pageBlock.id,
    title: properties['title'][0][0],
    author,
    date,
    visible,
    tags: properties['tags'][0][0].split(','),
    status: properties['status'][0][0],
    contents: pageBlock.content || [],
    properties: properties,
    createdAt: new Date(pageBlock.created_time),
    updatedAt: new Date(pageBlock.last_edited_time),
  }
}

const createPages = async ({}: CreatePagesArgs) => {
  const authToken = `24395ecb63b6177fbddd840cafda09d9f2454adfa8613048ab61cb1f0bb827049f0db0b573975e925d12d8a3e3d623b3ffae94eef3cdcb6da777ffb7d0c86f36a7e2f8277a24c0644e068723f946`
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

export default { createPages }
