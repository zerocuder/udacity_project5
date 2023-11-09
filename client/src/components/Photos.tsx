import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createPhoto, deletePhoto, getPhotos, patchPhoto } from '../api/photos-api'
import Auth from '../auth/Auth'
import { Photo } from '../types/Photo'

interface PhotosProps {
  auth: Auth
  history: History
}

interface PhotosState {
  photos: Photo[]
  newPhotoCaption: string
  loadingPhotos: boolean
}

export class Photos extends React.PureComponent<PhotosProps, PhotosState> {
  state: PhotosState = {
    photos: [],
    newPhotoCaption: '',
    loadingPhotos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPhotoCaption: event.target.value })
  }

  onEditButtonClick = (photoId: string) => {
    this.props.history.push(`/photos/${photoId}/edit`)
  }

  onAddButtonClick = () => {
    this.props.history.push(`/photos/add`)
  }

  onPhotoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newPhoto = await createPhoto(this.props.auth.getIdToken(), this.state.newPhotoCaption)
      this.setState({
        photos: [...this.state.photos, newPhoto],
        newPhotoCaption: ''
      })
    } catch {
      alert('Photo creation failed')
    }
  }

  onPhotoDelete = async (photoId: string) => {
    try {
      await deletePhoto(this.props.auth.getIdToken(), photoId)
      this.setState({
        photos: this.state.photos.filter(photo => photo.photoId !== photoId)
      })
    } catch {
      alert('Photo deletion failed')
    }
  }

  onPhotoCheck = async (pos: number) => {
    try {
      const photo = this.state.photos[pos]
      await patchPhoto(this.props.auth.getIdToken(), photo.photoId, photo.caption)
      this.setState({
        photos: update(this.state.photos, {
          [pos]: { caption: { $set: photo.caption } }
        })
      })
    } catch {
      alert('Photo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const photos = await getPhotos(this.props.auth.getIdToken())
      this.setState({
        photos: photos,
        loadingPhotos: false
      })
    } catch (e) {
      alert(`Failed to fetch photos: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        {this.renderAddPhotoInput()}
        <Header as="h1">PHOTOs</Header>
  
        {this.renderPhotos()}
      </div>
    )
  }

  renderAddPhotoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button
            label="Add new photo"
            labelPosition='right'
            color="blue"
            onClick={() => this.onAddButtonClick()}
          >
            <Icon name="add square"/>
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPhotos() {
    if (this.state.loadingPhotos) {
      return this.renderLoading()
    }

    return this.renderPhotosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading PHOTOs
        </Loader>
      </Grid.Row>
    )
  }

  renderPhotosList() {
    return (
      <Grid padded>
        {this.state.photos.map((photo, pos) => {
          return (
            <Grid.Row key={photo.photoId}>
              {/* <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPhotoCheck(pos)}
                  checked={false}
                />
              </Grid.Column> */}
              <Grid.Column width={10} verticalAlign="middle">
                {photo.caption}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {photo.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(photo.photoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPhotoDelete(photo.photoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {photo.photoUrl && (
                <Image src={photo.photoUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
