import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

//import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
import { TodoAccess } from '../../dataLayer/todosAccess'

import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)

const todoAccess = new TodoAccess()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    logger.info('Generating upload URL:', {
      todoId
    })
    const userId = getUserId(event)

    const uploadUrl = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
    logger.info('Generating upload URL:', {
      todoId,
      uploadUrl
    })

    await todoAccess.saveImgUrl(userId, todoId, bucketName)

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
