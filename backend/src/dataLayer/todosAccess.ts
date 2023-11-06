import * as AWS from 'aws-sdk'
const AWSXRay = require("aws-xray-sdk");
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosIndex = process.env.TODOS_CREATED_AT_INDEX
    ) { }

    async getTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todo items')

        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()
        return result.Items as TodoItem[]
    }

    async createTodo(newTodo: TodoItem): Promise<TodoItem> {
        logger.info(`Creating new todo item: ${newTodo.todoId}`)
        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: newTodo
            })
            .promise()
        return newTodo
    }

    async updateTodo(
        userId: string,
        todoId: string,
        updateData: TodoUpdate
    ): Promise<void> {
        logger.info(`Updating a todo item: ${todoId}`)
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ConditionExpression: 'attribute_exists(todoId)',
                UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
                ExpressionAttributeNames: { '#n': 'name' },
                ExpressionAttributeValues: {
                    ':n': updateData.name,
                    ':due': updateData.dueDate,
                    ':dn': updateData.done
                }
            })
            .promise()
    }

    async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: { userId, todoId }
            })
            .promise()
    }

    async saveImgUrl(
        userId: string,
        todoId: string,
        bucketName: string
    ): Promise<void> {
        try {
            await this.docClient
                .update({
                    TableName: this.todosTable,
                    Key: { userId, todoId },
                    ConditionExpression: 'attribute_exists(todoId)',
                    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                    ExpressionAttributeValues: {
                        ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
                    }
                })
                .promise()
            logger.info(
                `Updating image url for a todo item: https://${bucketName}.s3.amazonaws.com/${todoId}`
            )
        } catch (error) {
            logger.error(error)
        }
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log("Creating a local DynamoDB instance");
        return new XAWS.DynamoDB.DocumentClient({
            region: "localhost",
            endpoint: "http://localhost:8000",
        });
    }

    return new XAWS.DynamoDB.DocumentClient();
}