import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../dataLayer/todosAccess.mjs'
import { httpResponse, logger } from '../../auth/utils.mjs'
import { getUserId } from '../utils.mjs'

// Update a TODO item with the provided id using values in the "updatedTodo" object
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    try {
      const body = event.body
      logger.info('Update Todo Item', body);
      const todoId = event.pathParameters['todoId']
      const userId = getUserId(event)

      await updateTodo({
        todoId,
        userId,
        ...JSON.parse(body)
      })

      return httpResponse({
        message: 'Update Todo item was successed!'
      })
    } catch (error) {
      return httpResponseError(error)
    }
  })