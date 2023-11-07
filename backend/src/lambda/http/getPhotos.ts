import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getPhotossForUser } from '../../businessLogic/photos'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const photos = await getPhotossForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify(photos)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
