import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../dataLayer/todosAccess.mjs'
import { getUserId } from '../utils.mjs'
import { httpResponse, logger } from '../../auth/utils.mjs'

// Implement creating a new TODO item
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)   
    // Check validation on body
    if (!newTodo.name || !newTodo.dueDate) {
      return httpResponse(
        { message: 'Please provide fully data!' },
        RESPONSE_STATUS.BAD_REQUEST
      )
    }

    const userId = getUserId(event)

    logger.info('Add new todo item: ', newTodo)
    const item = await createTodo(newTodo, userId)

    return httpResponse({item})
  })