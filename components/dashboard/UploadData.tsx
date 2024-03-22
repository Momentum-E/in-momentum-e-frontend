import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const UploadData = () => {
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    } else {
      toast.error("Please select a CSV file.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [],
    },
  });

  const uploadFile = async () => {
    try {
      if (!file) {
        toast.info("Choose a file");
        return;
      }

      setUploadStatus("Uploading...");

      const response = await fetch(
        `https://in-momentum-e-backend.onrender.com/user-data/presignedUploadUrl`,
        {
          method: "POST",
          body: JSON.stringify({ fileName: file.name, type: file.type }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to get presigned URL");
        throw new Error("Failed to get presigned URL");
      }

      const { uploadURL } = await response.json();

      const uploadResponse = await axios.put(uploadURL, file, {
        onUploadProgress: progressEvent => {
          if (progressEvent.total !== null && progressEvent.total !== undefined) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
            setUploadStatus(`Upload Progress: ${percentCompleted}%`);
          } else {
            console.log('Upload Progress: Total size unknown.');
          }
        },
        headers: {
          'Content-Type': file.type,
        },
      });

      if (uploadResponse.status === 200) {
        toast.success("Upload Successful");
        setUploadStatus("");
        setFile(null);
      } else {
        toast.error("Upload Failed");
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Upload Data</h1>
      <div
        {...getRootProps()}
        className={`dropzone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the file here</p>
        ) : (
          <>
            {!file && <p>Drag 'n' drop a CSV file here, or click to select</p>}
            {file && (
              <p className="text-gray-500">Selected File: {file.name}</p>
            )}
          </>
        )}
      </div>
      <button
        onClick={uploadFile}
        disabled={!file}
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Upload
      </button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadData;
