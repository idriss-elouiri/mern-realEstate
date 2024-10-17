import { useEffect, useState } from "react";
import Hero from "../components/home/hero/Hero";
import Featured from "../components/home/featured/Featured";
import Recent from "../components/home/recent/Recent";
import Awards from "../components/home/awards/Awards";
import Price from "../components/home/price/Price";
import Team from "../components/team/Team";
import { BASE_URL } from "../BASE_URL";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  
  return (
    <>
      <Hero />
      <Featured />
      <Recent />
      <Awards />
      <Price />
      <Team />
    </>
  );
}
