import { CollectionPropertySchema } from 'notion-types'
import * as R from 'ramda'
import { Collection } from './collection'

export const getSchemaFromCollection = (collection: Collection) => {
  return R.mapObjIndexed<CollectionPropertySchema, string>((v, _, __) => v.name)(collection.schema)
}
