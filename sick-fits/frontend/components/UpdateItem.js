import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

import { ALL_ITEMS_QUERY } from './Items'

// import { uploadFile } from "./CreateItem";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    $image: String
    $largeImage: String
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`

class UpdateItem extends Component {
  state = {}

  handleChange = async e => {
    const { name, type, value } = e.target
    if (type === 'file' && name === 'image') {
      const files = e.target.files
      const data = new FormData()
      console.log(`uploading file...`, files[0])
      data.append('file', files[0])
      data.append('upload_preset', 'sickfits')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/twintails/image/upload',
        {
          method: 'POST',
          body: data
        }
      );

      const file = await res.json()

      this.setState({
        image: file.secure_url,
        largeImage: file.eager[0].secure_url
      })

      console.log('State:', this.state)
    } else {
      console.log('Change Handler: ', name, type, value)
      const val = type === 'number' ? parseFloat(value) : value
      this.setState({ [name]: val })
      console.log(this.state)
    }
  };

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    console.log(`uploading file...`, files[0])
    data.append('file', files[0])
    data.append('upload_preset', 'sickfits')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/twintails/image/upload',
      {
        method: 'POST',
        body: data
      }
    )

    const file = await res.json();

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
    console.log('State:', this.state)
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
  }

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>Item not found: {this.props.id}</p>
          if (data.item.image) {
            console.log(data)
          }
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form
                  onSubmit={e => {
                    console.log('Event:', e, 'Event Target: ', e.target)

                    this.updateItem(e, updateItem)

                  }}
                >
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="image">
                      Image:
                      {this.state.image ? (
                        <img src={this.state.image} alt="" />
                      ) : (
                        <img src={data.item.image} alt="" />
                      )}
                      <input
                        type="file"
                        id="image"
                        name="image"
                        placeholder="Upload a file"
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>

                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing' : 'e'} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    );
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
