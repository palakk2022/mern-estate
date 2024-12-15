import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                console.log('Listing ID from params:', params.listingId);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (!data || data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
              

            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
            {error && <p className="text-center my-7 text-2xl">Something went wrong...</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper modules={[Navigation]} navigation={true}>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>

                                <div
                                className='h-[530px]' style={{ background: `url(${url}) center no-repeat`,
                                backgroundSize: "cover",}}>
            
                                </div>
                                {/* <img
                                    src={url}
                                    alt={`Listing Image ${index + 1}`}
                                    className="w-full h-[500px] object-cover"
                                /> */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </main>
    );
}