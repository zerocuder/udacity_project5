import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3BucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = s3BucketName
    ) { }
    getAttachmentUrl(photoId: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${photoId}`
    }

    getSignedUrl(photoId: string): Promise<string> {
        return this.s3.getSignedUrlPromise('putObject', {
            Bucket: this.bucketName,
            Key: photoId,
            Expires: urlExpiration
        })
    }
}