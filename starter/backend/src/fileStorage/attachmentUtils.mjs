import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../auth/utils.mjs'

const s3Client = new S3Client();

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function createAttachmentPresignedUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId,
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 3600
  })

  logger.info(`PresignedURL of todoId ${todoId} = ${url}`);

  return url;
}