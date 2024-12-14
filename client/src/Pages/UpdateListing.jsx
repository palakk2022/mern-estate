import React, { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux';
import {useNavigate,useParams} from 'react-router-dom';
export default function CreateListing() {
  const navigate = useNavigate();
  const params = useParams();
  const {currentUser} = useSelector(state => state.user)
  const [files,setFiles]= useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false); // New state

       
  const [formdata, setFormdata] = useState(
    {
      imageUrls:[],
          name:'',
          description:'',
          address:'',
          type:'rent',
          bathrooms:1,
          bedrooms:1,
          furnished:false,
          parking:false,
          offer:false,
          regularPrice: 50, // Fixed typo here
          discountedPrice:0
  }
);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [uploading,setuploading] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const [error,setError]= useState(false);
console.log(files);

useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
  
      // Check for success status here
      if (data.success === false) {
        console.log(data.message);
        return;
      }
    console.log(data)
    setFormdata({
        ...data,
        imageUrls: data.imageUrls || [] // Ensure imageUrls is correctly set
    });
    };
  
    fetchListing();
  }, [params.listingId]); // Add the listingId dependency
  


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
  
        // Merge new uploaded images with existing images
        const updatedImages = [...formdata.imageUrls, ...uploadedPaths];
  
        setFormdata({
          ...formdata,
          imageUrls: updatedImages,
        });
  
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
        setFormdata({
          ...formdata,
          imageUrls: formdata.imageUrls.filter((path) => path !== filePath),
        });
      } else {
        setDeleteMessage('Failed to delete image!');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setDeleteMessage('Error deleting image!');
    }
  };
  
  const handleChange = (e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormdata({
    ...formdata,
        type:e.target.id
      })
    }
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id=== 'offer'){
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormdata({
        ...formdata,
        [e.target.id]: e.target.value
      })
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true); // Mark form as submitted
  
    // Validate uploaded images
    if (formdata.imageUrls.length === 0) {
      setError('Please upload at least one image before creating a listing.');
      return;
    }
  
    try {
      if (+formdata.regularPrice < +formdata.discountedPrice) {
        setError('Discounted Price should be less than Regular Price');
        return;
      }
      setLoading(true);
      setError(false);
  
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formdata,
          imageUrls: formdata.imageUrls, // Use formdata.imageUrls for images
          userRef: currentUser._id,
        }),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!data.success) {
        setError(data.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>

      <form onSubmit ={handleSubmit}className="flex flex-col sm:flex-row gap-4">
        < div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formdata.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
          value={formdata.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
          value={formdata.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formdata.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formdata.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formdata.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
              onChange={handleChange}
                checked={formdata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
              onChange={handleChange}
                checked={formdata.offer}
              />
              <span>Offer</span>
            </div>
            </div>
    
            <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formdata.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formdata.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
            <input
  type='number'
  id='regularPrice' // Remove extra space here
  min='50'
  max='10000000'
  required
  className='p-3 border border-gray-300 rounded-lg'
  onChange={handleChange}
  value={formdata.regularPrice}
/>

              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formdata.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formdata.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountedPrice'
                  min='0'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formdata.discountedPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                
                  {formdata.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
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
          {formdata.imageUrls.map((path, index) => (
    <div key={index} className="flex justify-between items-center mt-5">
      <img
        src={`http://localhost:4000${path}`}
        alt={`Listing image ${index + 1}`}
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
          //disabled={loading || uploadedImages.length === 0} // Disable button
        >
          {loading ? 'Creating...' : 'Update Listing'}
        </button>
            {/* Show error if form submitted without images
            {uploadedImages.length === 0 && (
<p className="text-red-500 text-sm mt-2">
  Please upload at least one image to create a listing.
</p>
)} */}
          {error && <p className='text-red-700 text-sm'>{error}</p>}
          </div>
      </form>
       
       
    </main>
  );
}
