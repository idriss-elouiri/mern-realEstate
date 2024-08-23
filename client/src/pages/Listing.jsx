import ListingDetailsComp from "../components/listingDetails/listingDetailsComp";
import { useParams } from 'react-router-dom';


export default function Listing() {
  const params = useParams();
  const listingId = params.listingId
  return (
    <>
     <ListingDetailsComp listingId={listingId} />
    </>
  );
}
