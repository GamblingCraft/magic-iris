import { getRuntimeRobotsTxt } from '../utils/site-discovery'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return getRuntimeRobotsTxt()
})
