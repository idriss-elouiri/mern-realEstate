import { useRef, useState, useEffect } from "react";
import "./Profile.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";
import { BASE_URL } from "../../BASE_URL";

const ProfileComp = () => {
  const [formData, setFormData] = useState({
    username: "John Doe",
    email: "john.doe@example.com",
    password: "",
    avatar: "/default-profile.png",
  });
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `${new Date().getTime()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => setFileUploadError(true),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({ ...prev, avatar: downloadURL }));
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${
          currentUser._id
        }`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${
          currentUser._id
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    setShowListingsError(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/listings/${
          currentUser._id
        }`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/listing/delete/${listingId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <main className="main">
      <form onSubmit={handleSubmit} className="profile-page">
        <div className="profile-image-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
            hidden
          />
          <img
            className="profile-image"
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error: Image upload (max 2 MB)
              </span>
            ) : filePerc > 0 ? (
              <span
                className={
                  filePerc === 100 ? "text-green-700" : "text-slate-700"
                }
              >
                {filePerc === 100
                  ? "Image successfully uploaded!"
                  : `Uploading ${filePerc}%`}
              </span>
            ) : null}
          </p>
        </div>
        <div className="profile-form">
          <label>
            Name:
            <input
              type="text"
              value={formData.username}
              onChange={handleChange}
              id="username"
              placeholder="username"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={handleChange}
              id="email"
              placeholder="email"
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              id="password"
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Update"}
          </button>
          <Link to="/create-listing" className="btn-listing">
            Create Listing
          </Link>
        </div>
        <div className="profile-actions">
          <span className="delete-account" onClick={handleDeleteUser}>
            Delete Account
          </span>
          <span className="sign-in" onClick={handleSignOut}>
            Sign Out
          </span>
        </div>
      </form>
      <Notification type="error" message={error} />
      <Notification
        type="success"
        message={updateSuccess ? "Update User Successfully" : ""}
      />
      <button onClick={handleShowListings}>Show Listings</button>
      {showListingsError && (
        <Notification type="error" message="Error showing listings" />
      )}
      {userListings.length > 0 &&
        userListings.map((listing) => (
          <div className="show-listing" key={listing._id}>
            <div className="listing-image-container">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt={listing.name}
                  className="listing-image"
                />
              </Link>
            </div>
            <Link to={`/listing/${listing._id}`}>
              <h2 className="listing-title">{listing.name}</h2>
            </Link>
            <div className="listing-buttons">
              <Link to={`/update-listing/${listing._id}`}>
                <button className="edit-button">
                  <FaEdit /> Edit
                </button>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleListingDelete(listing._id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
    </main>
  );
};

export default ProfileComp;
