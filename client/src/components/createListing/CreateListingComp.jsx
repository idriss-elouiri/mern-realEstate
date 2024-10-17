import React, { useState } from "react";
import "./CreateListing.css"; // Ensure this CSS file is created
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ReactSortable } from "react-sortablejs";
import { app } from "../../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";
const CreateListingComp = () => {
  const [isRent, setIsRent] = useState(true);
  const handleToggle = () => {
    setIsRent(!isRent);
  };
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "all",
    category: "none",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: "",
    parking: "none",
    furnished: "",
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  console.log(formData);
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sale" ||
      e.target.id === "rent"
    ) {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "category" ||
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  function updateImagesOrder(imageUrls) {
    setFormData({ ...formData, imageUrls });
  }
  return (
    <div className="create-listing-container">
      <h2>Create a New Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            onChange={handleChange}
            value={formData.description}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className="form-group">
          <label htmlFor="Category">Category:</label>
          <select
            id="category"
            name="category"
            onChange={handleChange}
            value={formData.category}
          >
            <option value="none">None</option>
            <option value="apartment">Apartment</option>
            <option value="condos">Condos</option>
            <option value="offices">Offices</option>
            <option value="homes & villas">Homes & Villas</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label>Type:</label>
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-button ${
                formData.type === "all" ? "active" : ""
              }`}
              onClick={handleChange}
              id="all"
            >
              All
            </button>
            <button
              type="button"
              className={`toggle-button ${
                formData.type === "rent" ? "active" : ""
              }`}
              onClick={handleChange}
              id="rent"
            >
              Rent
            </button>
            <button
              type="button"
              className={`toggle-button ${
                formData.type === "sale" ? "active" : ""
              }`}
              onClick={handleChange}
              id="sale"
            >
              Sale
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="parking">Parking Spot:</label>
          <select
            id="parking"
            name="parking"
            onChange={handleChange}
            value={formData.parking}
          >
            <option value="none">None</option>
            <option value="street">Street</option>
            <option value="garage">Garage</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="furnished">Furnished:</label>
          <select
            id="furnished"
            name="furnished"
            onChange={handleChange}
            value={formData.furnished}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="offer">offer:</label>
          <select
            id="offer"
            name="offer"
            onChange={handleChange}
            value={formData.offer}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="beds">Beds:</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            min="1"
            onChange={handleChange}
            value={formData.bedrooms}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="baths">Baths:</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            min="1"
            onChange={handleChange}
            value={formData.bathrooms}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="regular-price">Regular Price:</label>
          <input
            type="number"
            id="regularPrice"
            name="regularPrice"
            min="0"
            onChange={handleChange}
            value={formData.regularPrice}
            required
          />
        </div>
        {formData.offer === "yes" ? (
          <div className="form-group">
            <label htmlFor="discounted-price">Discounted Price:</label>
            <input
              type="number"
              id="discountPrice"
              name="discountPrice"
              min="0"
              onChange={handleChange}
              value={formData.discountPrice}
            />
          </div>
        ) : (
          ""
        )}
        <div className="form-group">
          <label htmlFor="images">Images:</label>
          <div>
            <input
              type="file"
              id="images"
              name="images"
              onChange={(e) => setFiles(e.target.files)}
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <Notification type={"error"} message={imageUploadError} />
          <ReactSortable list={formData.imageUrls} setList={updateImagesOrder}>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div key={url} className="box-listing">
                  <img
                    src={url}
                    alt="listing image"
                    className="listing-image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="delete-listing"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </ReactSortable>
        </div>

        <button type="submit" className="submit-button">
          {loading ? "Creating..." : "Create listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateListingComp;
