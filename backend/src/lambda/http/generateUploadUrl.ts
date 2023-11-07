import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { PhotoAccess } from '../../dataLayer/photosAccess'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

const photoAccess = new PhotoAccess()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const photoId = event.pathParameters.todoId
    logger.info('Generating upload URL:', {
      photoId
    })
    const userId = getUserId(event)

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: photoId,
      Expires: urlExpiration
    })
    logger.info('Generating upload URL:', {
      photoId,
      uploadUrl
    })

    await photoAccess.saveImgUrl(userId, photoId, bucketName)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
