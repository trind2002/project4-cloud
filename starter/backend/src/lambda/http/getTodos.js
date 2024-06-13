import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../dataLayer/todosAccess.mjs'
import { httpResponse } from '../../auth/utils.mjs'
import {getUserId} from '../utils.mjs'

// Get all TODO items for a current user
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    console.log('GET TODOS EVENT...', event);
    const userId = getUserId(event);
    const items = await getTodos(userId);

    return httpResponse({ items });
  })