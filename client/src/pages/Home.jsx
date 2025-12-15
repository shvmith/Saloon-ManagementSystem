import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authslices';
import woman from './woman.jpg';
// Import additional hero images
import heroImage1 from './woman.jpg';
import heroImage2 from './hero2.jpg';
import heroImage3 from './hero3.jpg';
import API_CONFIG from '../config/apiConfig';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

function SalonHomepage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({services: false, packages: false, reviews: false});
  const [error, setError] = useState({services: null, packages: null, reviews: null});
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(0);
  const [currentPackagePage, setCurrentPackagePage] = useState(0);
  // Add state for hero carousel
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const heroImages = [woman, heroImage1, heroImage2, heroImage3];
  const totalHeroSlides = heroImages.length;

  useEffect(() => {
    fetchServices();
    fetchPackages();
    fetchReviews();

    // Auto-advance hero carousel every 5 seconds
    const carouselInterval = setInterval(() => {
      nextHeroSlide();
    }, 5000);
    
    return () => clearInterval(carouselInterval);
  }, []);
  
  // Fetch services data
  const fetchServices = async () => {
    try {
      setLoading(prev => ({...prev, services: true}));
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch services');
      setServices(data);
    } catch (err) {
      setError(prev => ({...prev, services: err.message}));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#89198f',
      });
    } finally {
      setLoading(prev => ({...prev, services: false}));
    }
  };

  // Fetch packages data
  const fetchPackages = async () => {
    try {
      setLoading(prev => ({...prev, packages: true}));
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PACK}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch packages');
      setPackages(data);
    } catch (err) {
      setError(prev => ({...prev, packages: err.message}));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#89198f',
      });
    } finally {
      setLoading(prev => ({...prev, packages: false}));
    }
  };

  // Fetch reviews/feedback data
  const fetchReviews = async () => {
    try {
      setLoading(prev => ({...prev, reviews: true}));
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEEDBACK}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch reviews');
      
      // Filter to only show approved feedback
      const approvedReviews = data.filter(review => review.status === 'approved');
      setReviews(approvedReviews || []);
      
      console.log('Approved reviews:', approvedReviews.length);
    } catch (err) {
      setError(prev => ({...prev, reviews: err.message}));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        confirmButtonColor: '#89198f',
      });
    } finally {
      setLoading(prev => ({...prev, reviews: false}));
    }
  };

  // Handle logout function
  const handleLogout = () => {
    dispatch(logout());
  };

  const totalServicePages = Math.ceil(services.length / 3);
  const reviewsPerPage = 4; // Show 4 reviews per page
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage);
  const packagesPerPage = 3; // Show 3 packages per page
  const totalPackagePages = Math.ceil(packages.length / packagesPerPage);
  
  const handleDotClick = (pageIndex) => {
    setCurrentServicePage(pageIndex);
  };
  
  const handleReviewPageChange = (pageIndex) => {
    setCurrentReviewPage(pageIndex);
  };

  const nextReviewPage = () => {
    setCurrentReviewPage((prev) => (prev + 1) % totalReviewPages);
  };

  const prevReviewPage = () => {
    setCurrentReviewPage((prev) => (prev === 0 ? totalReviewPages - 1 : prev - 1));
  };

  const handlePackagePageChange = (pageIndex) => {
    setCurrentPackagePage(pageIndex);
  };

  const nextPackagePage = () => {
    setCurrentPackagePage((prev) => (prev + 1) % totalPackagePages);
  };

  const prevPackagePage = () => {
    setCurrentPackagePage((prev) => (prev === 0 ? totalPackagePages - 1 : prev - 1));
  };

  // Add hero carousel navigation functions
  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % totalHeroSlides);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? totalHeroSlides - 1 : prev - 1));
  };

  const goToHeroSlide = (index) => {
    setCurrentHeroSlide(index);
  };

  return (
    <div className="bg-PrimaryColor min-h-screen">
      {/* Use the Navbar component */}
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Hero Image Carousel */}
      <div className="relative w-full h-screen">
        {heroImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentHeroSlide === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={img}
              alt={`Salon hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {user ? `Welcome Back, ${user.name}!` : 'Discover Your Beauty at GlowSuite Salon'}
                </h1>
                <p className="text-xl mb-8">
                  {user ? 'Your next appointment awaits' : 'Premium beauty services since 2010'}
                </p>
                <a
                  href={user ? "./appointment/CreateAppontment" : "/signin"}
                  className="bg-navcolor hover:bg-DarkColor text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block"
                >
                  Book Now
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentHeroSlide === index 
                  ? 'bg-SecondaryColor w-6' 
                  : 'bg-white hover:bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <button 
          onClick={prevHeroSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextHeroSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 transition"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Services Section */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-DarkColor mb-12">Our Premium Services</h2>

          {loading.services && (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-DarkColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
            </div>
          )}

          {error.services && !loading.services && (
            <div className="text-center text-red-600 py-8">
              <p>{error.services}</p>
              <button
                onClick={fetchServices}
                className="mt-4 bg-DarkColor text-white py-2 px-4 rounded-lg hover:bg-ExtraDarkColor"
              >
                Retry
              </button>
            </div>
          )}

          {!loading.services && !error.services && services.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services
                  .slice(currentServicePage * 3, (currentServicePage * 3) + 3)
                  .map(service => (
                    <div
                      key={service._id || service.id}
                      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 duration-300"
                    >
                      <img
                        src={service.image ? `${API_CONFIG.BASE_URL}${service.image}` : '/images/default-service.jpg'}
                        alt={service.name}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-8">
                        <h3 className="text-2xl font-semibold text-DarkColor">{service.name}</h3>
                        <p className="text-gray-600 mt-3 min-h-[80px]">{service.description || 'Premium service'}</p>
                        <div className="flex justify-between items-center mt-6">
                          <div>
                            <span className="text-DarkColor font-bold text-xl">${service.price}</span>
                            <span className="text-gray-500 text-sm ml-2">({service.duration})</span>
                          </div>
                          <a 
                            href={user ? "./appointment/CreateAppontment" : "/signin"}
                            className="bg-SecondaryColor hover:bg-DarkColor text-white px-5 py-2 rounded-lg transition"
                          >
                            Book
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
                    
              {/* Pagination Dots */}
              {totalServicePages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-3">
                  {[...Array(totalServicePages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentServicePage === index 
                          ? 'bg-SecondaryColor w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`View page ${index + 1} of services`}
                    />
                  ))}
                </div>
              )}
              
              {/* <div className="mt-12 text-center">
                <h3 className="text-xl font-bold text-DarkColor mb-4">Looking for a specific service?</h3>
                <p className="text-gray-600 mb-6">Browse all {services.length} beauty services or book a consultation.</p>
                <a href="/services" className="bg-navcolor hover:bg-DarkColor text-white font-bold py-3 px-8 rounded-full transition duration-300 inline-block">
                  View All Services
                </a>
              </div> */}
            </>
          )}
          
          {!loading.services && !error.services && services.length === 0 && (
            <p className="text-center text-gray-500">No services available at the moment.</p>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 px-4 bg-SecondaryColor text-white">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Welcome to GlowSuite Salon</h2>
              <p className="text-lg mb-6 leading-relaxed">
                Since 2010, GlowSuite Salon has been the premier destination for beauty and wellness services. 
                Our team of expert stylists and beauty professionals are dedicated to helping you look and feel your best.
              </p>
              <p className="text-lg mb-8 leading-relaxed">
                We pride ourselves on using only the highest quality products and providing a luxurious, 
                relaxing environment for all our clients. Whether you're looking for a new hairstyle, 
                a rejuvenating facial, or a complete makeover, we're here to exceed your expectations.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-ExtraDarkColor p-5 rounded-lg text-center flex-1 min-w-[150px]">
                  <h3 className="text-2xl font-bold">10+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="bg-ExtraDarkColor p-5 rounded-lg text-center flex-1 min-w-[150px]">
                  <h3 className="text-2xl font-bold">5000+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="bg-ExtraDarkColor p-5 rounded-lg text-center flex-1 min-w-[150px]">
                  <h3 className="text-2xl font-bold">15+</h3>
                  <p>Expert Stylists</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                  alt="Salon interior" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-DarkColor p-4 rounded-lg shadow-xl hidden md:block">
                <p className="text-xl font-bold">Book Your Appointment</p>
                <p className="text-sm">Call us: (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-DarkColor mb-12">Special Packages</h2>
          
          {loading.packages && (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-DarkColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
            </div>
          )}

          {error.packages && !loading.packages && (
            <div className="text-center text-red-600 py-8">
              <p>{error.packages}</p>
              <button
                onClick={fetchPackages}
                className="mt-4 bg-DarkColor text-white py-2 px-4 rounded-lg hover:bg-ExtraDarkColor"
              >
                Retry
              </button>
            </div>
          )}

          {!loading.packages && !error.packages && (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
                  {packages.length > 0 ? (
                    packages
                      .slice(
                        currentPackagePage * packagesPerPage, 
                        (currentPackagePage * packagesPerPage) + packagesPerPage
                      )
                      .map(pkg => (
                        <div key={pkg._id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                          <div className="p-6">
                            <h3 className="text-2xl font-semibold text-DarkColor">{pkg.p_name}</h3>
                            <p className="text-gray-600 mt-2">{pkg.package_type}</p>
                            <div className="mt-4">
                              <p className="text-gray-700"><span className="font-semibold">Category:</span> {pkg.category}</p>
                              <p className="text-gray-700 mt-1"><span className="font-semibold">Duration:</span> {pkg.start_date && pkg.end_date ? 
                                `${new Date(pkg.start_date).toLocaleDateString()} - ${new Date(pkg.end_date).toLocaleDateString()}` : 
                                'Available now'}</p>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                              <div>
                                <span className="text-DarkColor font-bold text-xl">${pkg.final_price ? pkg.final_price.toFixed(2) : '0.00'}</span>
                                {pkg.discount_rate > 0 && (
                                  <span className="text-gray-500 text-sm ml-2">({pkg.discount_rate}% off)</span>
                                )}
                              </div>
                              <a 
                                href={user ? "./appointment/CreateAppontment" : "/signin"}
                                className="bg-SecondaryColor hover:bg-DarkColor text-white px-6 py-2 rounded-lg transition"
                              >
                                Book Package
                              </a>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-500 col-span-3">No packages available at the moment.</p>
                  )}
                </div>
                
                {/* Carousel Navigation Arrows */}
                {packages.length > packagesPerPage && (
                  <>
                    <button 
                      onClick={prevPackagePage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 hidden md:block"
                      aria-label="Previous packages"
                    >
                      <svg className="w-6 h-6 text-DarkColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextPackagePage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 hidden md:block"
                      aria-label="Next packages"
                    >
                      <svg className="w-6 h-6 text-DarkColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Pagination Indicators */}
              {totalPackagePages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-3">
                  {[...Array(totalPackagePages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePackagePageChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentPackagePage === index 
                          ? 'bg-SecondaryColor w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`View page ${index + 1} of packages`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-DarkColor mb-12">What Our Clients Say</h2>
          
          {loading.reviews && (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-DarkColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
            </div>
          )}

          {error.reviews && !loading.reviews && (
            <div className="text-center text-red-600 py-8">
              <p>{error.reviews}</p>
              <button
                onClick={fetchReviews}
                className="mt-4 bg-DarkColor text-white py-2 px-4 rounded-lg hover:bg-ExtraDarkColor"
              >
                Retry
              </button>
            </div>
          )}

          {!loading.reviews && !error.reviews && (
            <>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-500 ease-in-out">
                  {reviews.length > 0 ? (
                    reviews
                      .slice(
                        currentReviewPage * reviewsPerPage, 
                        (currentReviewPage * reviewsPerPage) + reviewsPerPage
                      )
                      .map(review => (
                        <div key={review._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-SecondaryColor flex items-center justify-center text-white font-bold mr-4">
                              {review.Username ? review.Username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-DarkColor">{review.Username}</h3>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-5 w-5 ${i < review.star_rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600">{review.message}</p>
                          <div className="mt-4 text-sm text-gray-500">
                            <p>Service: {review.serviceID || 'General Feedback'}</p>
                            <p className="mt-1">Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-gray-500 col-span-4">No approved reviews available at the moment.</p>
                  )}
                </div>
                
                {/* Carousel Navigation Arrows */}
                {reviews.length > reviewsPerPage && (
                  <>
                    <button 
                      onClick={prevReviewPage}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 hidden md:block"
                      aria-label="Previous reviews"
                    >
                      <svg className="w-6 h-6 text-DarkColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextReviewPage}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 z-10 hidden md:block"
                      aria-label="Next reviews"
                    >
                      <svg className="w-6 h-6 text-DarkColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Pagination Indicators */}
              {totalReviewPages > 1 && (
                <div className="flex justify-center items-center mt-10 space-x-3">
                  {[...Array(totalReviewPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleReviewPageChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        currentReviewPage === index 
                          ? 'bg-SecondaryColor w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`View page ${index + 1} of reviews`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-DarkColor text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">GlowSuite Salon</h3>
              <p className="mb-4">Award-winning salon since 2010, providing luxury beauty services.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-SecondaryColor transition">Home</a></li>
                <li><a href="#services" className="hover:text-SecondaryColor transition">Services</a></li>
                <li><a href="#packages" className="hover:text-SecondaryColor transition">Packages</a></li>
                <li><a href="#reviews" className="hover:text-SecondaryColor transition">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  456 GlowSuite Ave, Beauty City
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (555) 123-4567
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@glowsuitesalon.com
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <ul className="space-y-2">
                <li>Mon-Fri: 9:00 AM - 8:00 PM</li>
                <li>Saturday: 9:00 AM - 6:00 PM</li>
                <li>Sunday: 10:00 AM - 4:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>© 2025 GlowSuite Salon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SalonHomepage;