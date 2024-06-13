import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createAttachmentPresignedUrl } from '../../storageLayer/attachmentUtil.mjs'
import { RESPONSE_STATUS, httpResponse } from '../../auth/utils.mjs'

// Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    if (!todoId) {
      return httpResponse({ message: 'Please provide todoId!' }, RESPONSE_STATUS.BAD_REQUEST);
    }

    const uploadUrl = await createAttachmentPresignedUrl(todoId);

    return httpResponse(uploadUrl, RESPONSE_STATUS.SUCCESS)
  })