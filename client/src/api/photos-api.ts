import { apiEndpoint } from '../config'
import { Photo } from '../types/Photo';
import Axios from 'axios'

export async function getPhotos(idToken: string): Promise<Photo[]> {
  console.log('Fetching photos')

  const response = await Axios.get(`${apiEndpoint}/photos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Photos:', response.data)
  return response.data
}

export async function createPhoto(
  idToken: string,
  newPhotoCaption: string
): Promise<Photo> {
  const response = await Axios.post(`${apiEndpoint}/photos`,  JSON.stringify(newPhotoCaption), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function patchPhoto(
  idToken: string,
  photoId: string,
  updatedPhotoCaption: string
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/photos/${photoId}`, JSON.stringify(updatedPhotoCaption), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletePhoto(
  idToken: string,
  photoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/photos/${photoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  photoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/photos/${photoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
