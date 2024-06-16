import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../dataLayer/todosAccess.mjs'
import { httpResponse } from '../../auth/utils.mjs'

// Remove a TODO item by id
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const todoId = event.pathParameters['todoId'];
    const userId = getUserId(event);

    await deleteTodo(userId, todoId);

    return httpResponse({message: `TODO-${todoId} was removed`})
  })