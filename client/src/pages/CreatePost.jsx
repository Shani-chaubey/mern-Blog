import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { app } from "./../firebase";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadImageProgress, setUploadImageProgress] = useState(null);
  const [uploadImageProgressError, setUploadImageProgressError] =
    useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const handleUploadImage = async () => {
    setUploadImageProgressError(null);
    if (!file) {
      setUploadImageProgressError("Please choose an Image First");
    }else{
      try {
        const storage = getStorage(app);
        const filename = new Date().getTime() + file.name;
        const storageRef = ref(storage, `/BlogImages/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadImageProgress(percent);
          },
          (err) => {
            setUploadImageProgressError("Upload Failed");
            setUploadImageProgress(null);
          },
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFormData({ ...formData, image: downloadURL });
              setUploadImageProgress(null);
              setUploadImageProgressError(null);
            });
          }
        );
      } catch (error) {
        setUploadImageProgressError("Upload Failed");
        setUploadImageProgress(null);
      }
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`)
      }
    } catch (error) {
      setPublishError(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold my-7">Create A Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handlePublish}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 m"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a Category</option>
            <option value="investmen-guide">Investment Guide</option>
            <option value="personal">Personal</option>
            <option value="money-earing">Money Earning</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          ></FileInput>
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={uploadImageProgress}
          >
            {uploadImageProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadImageProgress}
                  text={`${uploadImageProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {uploadImageProgressError && (
          <Alert color="failure">{uploadImageProgressError}</Alert>
        )}
        {formData.image && (
          <img src={formData.image} className="w-full h-72 object-cover" />
        )}
        <ReactQuill
          type="editor"
          theme="snow"
          placeholder="Write your blog here..."
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type="submit" gradientDuoTone="purpleToPink" required>
          Publish
        </Button>
        { publishError && (
          <Alert color="failure">{publishError}</Alert>
        )}
      </form>
    </div>
  );
}
