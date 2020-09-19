import * as R from 'ramda'
import { NotionAPI } from 'notion-client'

export const createPages = async () => {
  const api = new NotionAPI({
    authToken: `d67eea8605f9e9d5630e19ae5b33698848bb15fc11c97706c6f5f1a429cc253b332923dce4e860a02d52534cbe46505e926c558cb8ad6336e692ea901095dc905ee7519b7aebf56f77366c5d5f87`,
  })

  // const page = await api.getPage('2f97a5c7-416d-4e84-aab9-02fd8ded368d')
  // const collectionData = await api.getCollectionData(
  //   'a83f302c-6fac-4679-9492-be11ec9befd9',
  //   '9ac2f659-2826-40b1-9a92-2db05d033648',
  // )
  //
  // console.log(collectionData.result.blockIds)

  // const pages = await Promise.all(collectionData.result.blockIds.map((pageId) => api.getPageRaw(pageId.toString())))

  const page = await api.getPageRaw('2c4163b6-79eb-4a5a-b214-b47f1af39bb7')
  const blocks = R.values(page.recordMap.block)
    .map((block) => block.value)
    .filter((block) => block.type === 'code')
  console.log(blocks)

  // if (pages.length > 0) {
  //   const page = pages[0]
  //   console.log(page)
  //   // console.log(page.block['67f7c649-7a4f-43a9-9392-3df71fd18b02'].value)
  // }

  // for (const block of page.block as any) {
  //   console.log(page.block)
  // }
}
