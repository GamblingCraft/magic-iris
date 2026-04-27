import { getRuntimeSitemapXml } from '../utils/site-discovery'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return getRuntimeSitemapXml()
})
