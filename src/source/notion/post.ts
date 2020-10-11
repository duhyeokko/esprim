import { NotionAPI } from 'notion-client'
import {
  Block,
  BlockMap,
  DateFormat,
  Decoration,
  ExtendedRecordMap,
  PageBlock,
  Role,
  SubDecoration,
} from 'notion-types'
import * as R from 'ramda'

export interface Post {
  id: string
  title: string
  author: SubDecoration | undefined
  date: string | undefined
  visible: boolean
  tags: string[]
  status: string
  contents: Block[]
  rawContents: BlockMap
  properties: {
    [key: string]: Decoration[]
  }
  rawPage: ExtendedRecordMap
  createdAt: Date
  updatedAt: Date
}

interface BlockMapValue {
  role: Role
  value: Block
}

export const buildPostFromPageBlock = async (
  notion: NotionAPI,
  schema: { [k: string]: string },
  pageBlock: PageBlock,
): Promise<Post> => {
  const rawProperties = pageBlock.properties || {}
  const rawPropertiesPairs = R.toPairsIn<Decoration[]>(rawProperties)
  const filteredPropertiesPairs = R.filter<[string, Decoration[]]>((pair) => {
    const key = pair[0]
    return !R.isNil(schema[key])
  })(rawPropertiesPairs)
  const filteredProperties = R.fromPairs(filteredPropertiesPairs)

  const keys = R.pipe(
    R.keysIn,
    R.map((key) => schema[key]),
    R.map(R.toLower),
  )(filteredProperties)
  const values = R.valuesIn<Decoration[]>(filteredProperties)
  const properties = R.zipObj(keys, values)

  const visible = properties['visible'] ? properties['visible'][0][0] === 'Yes' : false
  const author = properties['author'][0][1] ? properties['author'][0][1][0] : undefined
  const date = properties['date'][0][1] ? (properties['date'][0][1]![0] as DateFormat)[1]['start_date'] : undefined
  const foo = await notion.getBlocks(pageBlock.content || [])
  foo.recordMap.block

  const rawContents = (await notion.getBlocks(pageBlock.content || [])).recordMap.block
  const contents = R.map((i) => i.value, R.valuesIn<BlockMapValue>(rawContents))
  const tags = properties['tags'][0][0].split(',')
  const status = properties['status'][0][0]
  const title = properties['title'][0][0]
  const id = pageBlock.id

  const createdAt = new Date(pageBlock.created_time)
  const updatedAt = new Date(pageBlock.last_edited_time)
  const rawPage = await notion.getPage(id)
  return {
    id,
    title,
    author,
    date,
    visible,
    tags,
    status,
    contents,
    rawContents,
    properties,
    rawPage,
    createdAt,
    updatedAt,
  }
}
