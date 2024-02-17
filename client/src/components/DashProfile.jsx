import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateDone,
  updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
  const [userUpdateError, setUserUpdateError] = useState(null);

  if(userUpdateSuccess){
    setTimeout(()=>{
      setUserUpdateSuccess(null)
    },2000)
  }
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    setImageFileUploadError(null);
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setUserUpdateSuccess(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "File must be less than 2 MB & must have type ImageFile"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileURL(null);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setUserUpdateSuccess(null);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    setUserUpdateError(null)
    e.preventDefault(e);
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        dispatch(updateDone(data));
        setUserUpdateSuccess('User Updated Successfully')
      } else {
        dispatch(updateFailure(data.message));
        setUserUpdateError(data.message);
      }
    } catch (error) {
      dispatch(updateFailure(401, error));
      setUserUpdateError(data.message);
    }
  };
 
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileURL || currentUser.profilePicture}
            alt="Profile picture"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] 
            ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 justify-between flex">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      { userUpdateSuccess && (
        <Alert className="mt-5" color="success">
          {userUpdateSuccess}
        </Alert>
      )}
      { userUpdateError && (
        <Alert className="mt-5" color="failure">
          {userUpdateError}
        </Alert>
      )}
    </div>
  );
}