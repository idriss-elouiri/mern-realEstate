import React, { useState, useCallback } from "react";
import "./CreateListing.css"; 
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
    offer: "no",
    parking: "none",
    furnished: "no",
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => setFormData((prev) => ({ ...prev, type: prev.type === "rent" ? "sale" : "rent" }));

  const handleImageSubmit = useCallback(async () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError("");

      try {
        const uploadPromises = Array.from(files).map(storeImage);
        const urls = await Promise.all(uploadPromises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
      } catch (err) {
        setImageUploadError("Image upload failed (2 mb max per image)");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload up to 6 images per listing");
    }
  }, [files, formData.imageUrls]);

  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        reject,
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = useCallback((e) => {
    const { id, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? e.target.checked : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
    if (+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price");

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/listing/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message || "An error occurred while creating the listing.");
    } finally {
      setLoading(false);
    }
  };

  const updateImagesOrder = (imageUrls) => {
    setFormData((prev) => ({ ...prev, imageUrls }));
  };

  return (
    <div className="create-listing-container">
      <h2>Create a New Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        {/* Form Fields */}
        <InputField id="name" label="Title:" value={formData.name} onChange={handleChange} required />
        <TextareaField id="description" label="Description:" value={formData.description} onChange={handleChange} required />
        <InputField id="address" label="Address:" value={formData.address} onChange={handleChange} />
        <SelectField id="category" label="Category:" options={["none", "apartment", "condos", "offices", "homes & villas", "commercial"]} value={formData.category} onChange={handleChange} />
        
        {/* Type Selection */}
        <div className="form-group">
          <label>Type:</label>
          <div className="toggle-buttons">
            {["all", "rent", "sale"].map((type) => (
              <button
                key={type}
                type="button"
                className={`toggle-button ${formData.type === type ? "active" : ""}`}
                onClick={() => setFormData((prev) => ({ ...prev, type }))}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Fields */}
        <SelectField id="parking" label="Parking Spot:" options={["none", "street", "garage"]} value={formData.parking} onChange={handleChange} />
        <SelectField id="furnished" label="Furnished:" options={["no", "yes"]} value={formData.furnished} onChange={handleChange} />
        <SelectField id="offer" label="Offer:" options={["no", "yes"]} value={formData.offer} onChange={handleChange} />
        <InputField id="bedrooms" label="Beds:" type="number" min="1" value={formData.bedrooms} onChange={handleChange} required />
        <InputField id="bathrooms" label="Baths:" type="number" min="1" value={formData.bathrooms} onChange={handleChange} required />
        <InputField id="regularPrice" label="Regular Price:" type="number" min="0" value={formData.regularPrice} onChange={handleChange} required />
        
        {/* Discount Price field */}
        {formData.offer === "yes" && (
          <InputField id="discountPrice" label="Discounted Price:" type="number" min="0" value={formData.discountPrice} onChange={handleChange} />
        )}

        {/* Image Upload Section */}
        <div className="form-group">
          <label htmlFor="images">Images:</label>
          <div>
            <input type="file" id="images" name="images" onChange={(e) => setFiles(e.target.files)} multiple />
            <button type="button" disabled={uploading} onClick={handleImageSubmit}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <Notification type="error" message={imageUploadError} />
          <ReactSortable list={formData.imageUrls} setList={updateImagesOrder}>
            {formData.imageUrls.map((url, index) => (
              <div key={url} className="box-listing">
                <img src={url} alt="listing" className="listing-image" />
                <button type="button" onClick={() => handleRemoveImage(index)} className="delete-listing">
                  Delete
                </button>
              </div>
            ))}
          </ReactSortable>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ id, label, type = "text", value, onChange, required = false, min }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <input type={type} id={id} value={value} onChange={onChange} required={required} min={min} />
  </div>
);

// Reusable Textarea Component
const TextareaField = ({ id, label, value, onChange, required = false }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <textarea id={id} value={value} onChange={onChange} required={required} />
  </div>
);

// Reusable Select Component
const SelectField = ({ id, label, options, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default CreateListingComp;
