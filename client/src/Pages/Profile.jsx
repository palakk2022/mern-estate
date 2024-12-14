import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure
} from '../redux/user/userSlice';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser,loading ,error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess,setUpdateSuccess]= useState(false);
  const [showListingsError,setshowListingsError] = useState(false);
  const [userListing,setUserListing]= useState([]);
  // Initialize formData with current user values
  useEffect(() => {
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
  }, [currentUser]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
          setFilePerc(100);
          setFileUploadError(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value || undefined,
    }));
    console.log({ [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
     

      const data = await res.json();

      if (!res.ok || data.success === false) {
        console.error('Update failed:', data.message);
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error during update:', error);
      dispatch(updateUserFailure(error.message));
    }
  };
         const handleDeleteUser = async()=>{
          try{
                   dispatch(deleteUserStart());
                   const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                    method:'DELETE',
                   });
                   const data = await res.json();
                   if(data.success === false ){
                    dispatch(deleteUserFailure(data.message));
                    return;
                  
                   }
          dispatch(deleteUserSuccess(data));
          }catch(error){
            dispatch(deleteUserFailure(error.message))
          }
         }


         const handleSignOut = async ()=>{
          try{

            dispatch(signoutUserStart());
                   const res = await fetch('/api/auth/signOut' ,{
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                   });
                   const data = await res.json();
                   if(data.success === false ){
                    dispatch(signoutUserFailure(data.message));
                    return;
                   }
                   dispatch(signoutUserSuccess(data));
          }catch(error){
            dispatch(signoutUserFailure(data.message))
          }
         }

         const handleShowListings = async () => {
          setshowListingsError(false);
        
          try {
           const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWE4NzUzNmRhNDhiMTI5NDViYTljNyIsImlhdCI6MTczNDA5MTg1MH0.N86mSvlKU3BYJmbdTwj9jlPQHHP91uU8sL6LvQhuC2A"; // Use quotes for the token
        
            const res = await fetch(`/api/user/listings/${currentUser._id}`, {
              headers: {
                Authorization: `Bearer ${token}`, // Add the token here
              },
            });
        
            const data = await res.json();
            if (!res.ok) {
              setshowListingsError(true);
              console.error("Error:", data.message);
              return;
            }
        setUserListing(data);
            console.log(data); // Check the received data
          } catch (error) {
            setshowListingsError(true);
            console.error("Error:", error);
          }
        };
        const handleListingDelete = async(listingId) =>{
          const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWE4NzUzNmRhNDhiMTI5NDViYTljNyIsImlhdCI6MTczNDA5MTg1MH0.N86mSvlKU3BYJmbdTwj9jlPQHHP91uU8sL6LvQhuC2A"; // Use quotes for the token
          try{
             const res = await fetch(`/api/listing/delete/${listingId}`,{
              method:'DELETE',
              headers: {
                Authorization: `Bearer ${userToken}`, // Include token if required
            },
             });
             const data = await res.json();
             if(data.success === false){
              console.log(data.message);
              return;
             }

             setUserListing((prev)=> prev.filter((listing)=> listing._id !== listingId));
          }catch(error){
          console.log(error.message)
          }
        }
        
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || 'default-avatar.jpg'}
          alt='Profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error uploading image (must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Username'
          id='username'
          value={formData.username || ''}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          id='email'
          value={formData.email || ''}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          id='password'
          value={formData.password || ''}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
        disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3  hover:opacity-95 disabled:opacity-80'
          //disabled={filePerc > 0 && filePerc < 100}
        >
        {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}> Create Listing</Link>
      </form>
      <div className='flex  justify-between'>
        <span onClick={handleDeleteUser}className='text-red-700 rounded-lg'>Delete Account</span>
        <span onClick={handleSignOut}className='text-red-700 rounded-lg'>sign out</span>
      </div>

      <p className='text-green-700 mt-5'>{updateSuccess ? 'user is updated successfully': ''}</p>

      <button onClick={handleShowListings}className='text-green-700 w-full'>show listings</button>
      <p className='text-red-700 mt-5'> {showListingsError ? 'Error while showing listings': ''}</p>


      {userListing && userListing.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
   
                <img
                  src={`http://localhost:4000${listing.imageUrls[0]}`}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}