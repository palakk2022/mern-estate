import React, { useState } from 'react';

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.filePath;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageSubmit = async () => {
    if (files.length > 0 && files.length <= 6) {
      setLoading(true); // Start loading
      setUploadMessage(''); // Clear previous messages

      try {
        const promises = files.map((file) => storeImage(file));
        const uploadedPaths = await Promise.all(promises);

        setUploadedImages([...uploadedImages, ...uploadedPaths]);
        setFiles([]);
        setUploadMessage('Images uploaded successfully!');
      } catch (error) {
        setUploadMessage('Error uploading images!');
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please upload between 1 and 6 images.');
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const response = await fetch('http://localhost:4000/api/delete-file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath }),
      });
      const data = await response.json();

      if (data.success) {
        setDeleteMessage('Image deleted successfully!');
        setUploadedImages(uploadedImages.filter((path) => path !== filePath));
      } else {
        setDeleteMessage('Failed to delete image!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteMessage('Error deleting image!');
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>

      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
        </div>

        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-grey-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 mt-3">
            <input
              onChange={(e) => setFiles([...e.target.files])}
              className="p-3 border border-grey-300 rounded"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              disabled={loading} // Disable the button when loading
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {/* Loading spinner */}
          {loading && (
            <div className="mt-3 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-2">Uploading images...</p>
            </div>
          )}

          {uploadMessage && <p className="text-green-500 mt-2">{uploadMessage}</p>}
          {deleteMessage && <p className="text-red-500 mt-2">{deleteMessage}</p>}

          <div className="mt-5">
            {uploadedImages.map((path, index) => (
              <div key={index} className="flex  justify-between items-center mt-5">
                <img
                  src={`http://localhost:4000${path}`}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => deleteFile(path)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase text-center hover:opacity-95 disabled:opacity-80 mt-4"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
