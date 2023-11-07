import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
// import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { addPhoto } from '../../businessLogic/photos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const caption = JSON.parse(event.body)
    const photo = await addPhoto(userId, caption)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(photo)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
