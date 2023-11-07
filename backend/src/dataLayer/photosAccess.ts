import * as AWS from 'aws-sdk'
const AWSXRay = require("aws-xray-sdk");

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { PhotoItem } from '../models/PhotoItem'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('PhotosAccess')

export class PhotoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly photosTable = process.env.PHOTOS_TABLE,
        private readonly photosIndex = process.env.PHOTOS_CREATED_AT_INDEX
    ) { }

    async getPhotos(userId: string): Promise<PhotoItem[]> {
        logger.info('Getting all photo items')

        const result = await this.docClient
            .query({
                TableName: this.photosTable,
                IndexName: this.photosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise()
        return result.Items as PhotoItem[]
    }

    async addPhoto(newPhoto: PhotoItem): Promise<PhotoItem> {
        logger.info(`Add new photo item: ${newPhoto.photoId}`)
        await this.docClient
            .put({
                TableName: this.photosTable,
                Item: newPhoto
            })
            .promise()
        return newPhoto
    }

    async editPhoto(
        userId: string,
        photoId: string,
        caption: string
    ): Promise<void> {
        logger.info(`Updating a photo item: ${photoId}`)
        await this.docClient
            .update({
                TableName: this.photosTable,
                Key: { userId: userId, photoId: photoId },
                ConditionExpression: 'attribute_exists(photoId)',
                UpdateExpression: 'set #n = :n',
                ExpressionAttributeNames: { '#n': 'caption' },
                ExpressionAttributeValues: {
                    ':n': caption
                }
            })
            .promise()
    }

    async deletePhoto(userId: string, photoId: string): Promise<void> {
        await this.docClient
            .delete({
                TableName: this.photosTable,
                Key: { userId, photoId }
            })
            .promise()
    }

    async saveImgUrl(
        userId: string,
        photoId: string,
        bucketName: string
    ): Promise<void> {
        try {
            await this.docClient
                .update({
                    TableName: this.photosTable,
                    Key: { userId, photoId },
                    ConditionExpression: 'attribute_exists(photoId)',
                    UpdateExpression: 'set photoUrl = :photoUrl',
                    ExpressionAttributeValues: {
                        ':photoUrl': `https://${bucketName}.s3.amazonaws.com/${photoId}`
                    }
                })
                .promise()
            logger.info(
                `Updating image url for a photo item: https://${bucketName}.s3.amazonaws.com/${photoId}`
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