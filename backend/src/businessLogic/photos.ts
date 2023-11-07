import { PhotoAccess } from '../dataLayer/photosAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('PhotoAccess')
const attachmentUtils = new AttachmentUtils()
const photoAccess = new PhotoAccess()

export const getPhotossForUser = async (userId: string) => {
    return photoAccess.getPhotos(userId)
}

export const addPhoto = async (userId: string, caption: string) => {
    const photoId = uuid.v4()
    logger.info(`Creating photo ${photoId}`)
    const attachmentUrl = attachmentUtils.getAttachmentUrl(photoId)
    return photoAccess.addPhoto({
        userId,
        photoId,
        caption,
        photoUrl: attachmentUrl,
        createdAt: new Date().toISOString()
    })
}

export const editPhoto = async (
    userId: string,
    photoId: string,
    caption: string
) => {
    return photoAccess.editPhoto(userId, photoId, caption)
}

export const deletePhoto = async (userId: string, photoId: string) => {
    return photoAccess.deletePhoto(userId, photoId)
}