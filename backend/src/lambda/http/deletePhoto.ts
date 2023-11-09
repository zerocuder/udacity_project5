import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deletePhoto } from '../../businessLogic/photos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const photoId = event.pathParameters.photoId
    const userId = getUserId(event)
    await deletePhoto(userId, photoId)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({})
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
