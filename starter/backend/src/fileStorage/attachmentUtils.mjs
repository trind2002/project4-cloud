import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import AWSXRay from 'aws-xray-sdk-core'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../auth/utils.mjs';

const s3Client = new S3Client();

const s3ClientXRay = AWSXRay.captureAWSv3Client(s3Client)

export async function createAttachmentPresignedUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: process.env.ATTACHMENT_S3_BUCKET,
    Key: todoId
  })

  const url = await getSignedUrl(s3ClientXRay, command, {
    expiresIn: 3600
  })

  logger.info(`PresignedURL of todoId ${todoId} = ${url}`);

  return url;
}