import { Block, PageBlock } from 'notion-types'
import * as R from 'ramda'
import { Collection } from './collection'

export const getPageBlocksFromCollection = (collection: Collection): PageBlock[] => {
  return R.pipe(
    R.valuesIn,
    R.map<any, Block>((i) => i.value as Block),
    R.filter<Block>(
      (block) => block.type === 'page' && block.parent_id === collection.id && block.parent_table === 'collection',
    ),
    R.map<Block, PageBlock>((block) => block as PageBlock),
  )(collection.data.recordMap.block)
}
