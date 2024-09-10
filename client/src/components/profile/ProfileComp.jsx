import { useRef, useState, useEffect } from "react";
import "./Profile.css";
import { useSelector } from "react-redux";
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
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../../redux/user/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Notification from "../notification/Notification";
import { BASE_URL } from "../../BASE_URL";
const ProfileComp = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/user/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `
        /api/listing/delete/${listingId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <div className="profile-form">
          <label>
            Name:
            <input
              type="text"
              defaultValue={currentUser.username}
              onChange={handleChange}
              id="username"
              placeholder="username"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              defaultValue={currentUser.email}
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
          <Link to={"/create-listing"} className="btn-listing">
            Create Listing
          </Link>
        </div>
        <div className="profile-actions">
          <button className="delete-account" onClick={handleDeleteUser}>
            Delete Account
          </button>
          <button className="sign-in" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </form>
      <Notification type={"error"} message={error} />
      <Notification type={"success"} message={"Update User Successfully"} />
      <button onClick={handleShowListings}>Show Listings</button>
      {showListingsError && (
        <Notification type={"error"} message={"Error showing listings"} />
      )}
      {userListings && userListings.length > 0 && (
        <>
          {userListings.map((listing) => (
            <div className="show-listing">
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
                <button className="delete-button" onClick={handleListingDelete}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  );
};

export default ProfileComp;
