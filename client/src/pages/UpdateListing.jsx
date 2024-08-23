import React from 'react'
import { useParams } from 'react-router-dom'
import UpdatedListingComp from '../components/updateListing/UpdateListingComp'

const UpdateListing  = () => {
  const params = useParams()
  const listingId = params.listingId
  return (
    <><UpdatedListingComp listingId={listingId}/></>
  )
}

export default UpdateListing