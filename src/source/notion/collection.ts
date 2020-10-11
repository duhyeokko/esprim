import { NotionAPI } from 'notion-client'
import { CollectionInstance, CollectionPropertySchemaMap } from 'notion-types'
import * as R from 'ramda'

export interface Collection {
  id: string
  viewId: string
  schema: CollectionPropertySchemaMap
  data: CollectionInstance
}

export const getCollection = async (notion: NotionAPI, pageId: string): Promise<Collection | null> => {
  try {
    const page = await notion.getPage(pageId)

    const collections = R.values(page.collection)
    const collectionViews = R.values(page.collection_view)

    if (R.isEmpty(collections) || R.isEmpty(collectionViews)) {
      console.error('Empty collection is not allowed')
      return null
    }

    const collection = R.head(collections)?.value
    const collectionView = R.head(collectionViews)?.value

    if (R.isNil(collection) || R.isNil(collectionView)) {
      console.error('Empty collection is not allowed')
      return null
    }

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
