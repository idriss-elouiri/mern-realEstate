import React, { useEffect, useState } from "react";
import "./UpdatedListing.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { ReactSortable } from "react-sortablejs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Notification from "../notification/Notification";

const MAX_IMAGES = 6;

const UpdatedListingComp = ({ listingId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isRent, setIsRent] = useState(true);
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

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listing/get/${listingId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        setFormData(data);
      } else {
        console.error(data.message);
      }
    };

    fetchListing();
  }, [listingId]);

  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleImageSubmit = async () => {
    if (
      files.length > 0 &&
      files.length + formData.imageUrls.length <= MAX_IMAGES
    ) {
      setUploading(true);
      setImageUploadError("");

      try {
        const uploadPromises = Array.from(files).map(storeImage);
        const urls = await Promise.all(uploadPromises);
        setFormData((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
      } catch (error) {
        setImageUploadError("Image upload failed (max 2 MB per image)");
      } finally {
        setUploading(false);
      }
    } else {
      setImageUploadError(
        `You can only upload ${MAX_IMAGES} images per listing`
      );
    }
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (formData.imageUrls.length < 1)
      return "You must upload at least one image";
    if (formData.regularPrice < formData.discountPrice)
      return "Discount price must be lower than regular price";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listing/update/${listingId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        navigate(`/listing/${data._id}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <h2>Update Listing</h2>
      <form onSubmit={handleSubmit} className="listing-form">
        {/* Input fields */}
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            {key === "description" ? (
              <textarea
                id={key}
                rows="4"
                onChange={handleChange}
                value={formData[key]}
                required
              />
            ) : (
              <input
                type={typeof formData[key] === "number" ? "number" : "text"}
                id={key}
                onChange={handleChange}
                value={formData[key]}
                required={key === "name" || key === "address"}
              />
            )}
          </div>
        ))}
        {/* Image Upload Section */}
        <div className="form-group">
          <label htmlFor="images">Images:</label>
          <div>
            <input
              type="file"
              id="images"
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
          <p className="text-red-700 text-sm">{imageUploadError}</p>
          <Notification type={"error"} message={imageUploadError} />
          <ReactSortable list={formData.imageUrls} setList={updateImagesOrder}>
            {formData.imageUrls.map((url, index) => (
              <div key={url} className="box-listing">
                <img src={url} alt="listing" className="listing-image" />
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
          {loading ? "Updating..." : "Update Listing"}
        </button>
        {error && <p className="text-red-700">{error}</p>}
      </form>
    </div>
  );
};

export default UpdatedListingComp;
