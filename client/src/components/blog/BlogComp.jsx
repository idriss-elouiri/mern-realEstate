import React, { useEffect, useState } from "react"
import Back from "../common/Back"
import "../home/recent/Recent.css"
import img from "../images/blog.jpg"
import RecentCard from "../recent/RecentCard"

const BlogComp = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch("/api/listing/get");
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListings(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchListing();
  }, []);
  return (
    <>
      <section className='blog-out mb'>
        <Back name='Blog' title='Blog Grid - Our Blogs' cover={img} />
        <div className='container recent'>
          <RecentCard listings={listings}/>
        </div>
      </section>
    </>
  )
}

export default BlogComp