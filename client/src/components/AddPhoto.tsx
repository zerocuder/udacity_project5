import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/photos-api'
import { createPhoto, deletePhoto, getPhotos, patchPhoto } from '../api/photos-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface AddPhotoProps {
  auth: Auth
}

interface AddPhotoState {
  caption: string
  file: any
  uploadState: UploadState
}

export class AddPhoto extends React.PureComponent<
  AddPhotoProps,
  AddPhotoState
> {
  state: AddPhotoState = {
    caption: '',
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleCaptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ caption: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if(this.state.caption.length < 5) {
        alert('Caption should be greater than 5 char')
        return
      }

      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      const newPhoto = await createPhoto(this.props.auth.getIdToken(), this.state.caption)

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), newPhoto.photoId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Add new photo error: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Add new photo</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Caption</label>
            <input
              name="caption"
              type="text"
              placeholder="Photo caption"
              onChange={this.handleCaptionChange}
            />
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Submit
        </Button>
      </div>
    )
  }
}
