import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-furlink-blue to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Link with service providers
                  <br />
                  <span className="text-furlink-yellow">in just one click</span>
                </h1>
                
                <Link 
                  to="/login"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-furlink-blue transition-all duration-300 transform hover:scale-105"
                >
                  Book now
                </Link>
              </div>

              {/* Right Content - Hero Image */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-cyan-200 to-cyan-400 rounded-3xl p-8 max-w-md w-full">
                  <img 
                    src="https://images.pexels.com/photos/6568461/pexels-photo-6568461.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Cat and dog getting groomed" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is furlink Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-furlink-blue mb-6">
                What furlink is
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-semibold text-furlink-blue">furlink</span> offers a hassle-free experience for both customers and service providers. It enables grooming 
                  businesses to advertise their services while allowing pet owners to discover, schedule, and manage 
                  appointments in one place. It can innovative AI-powered grooming preview tool, giving users a visual 
                  reference of potential pet haircut styles before booking—bridging the gap between customer 
                  expectations and actual grooming outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How to use furlink Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-furlink-blue mb-12">
                How to use furlink
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Pet Owner Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-furlink-blue hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-furlink-yellow to-yellow-500 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                      <span className="text-4xl">🐾</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-furlink-blue mb-4">pet owner</h3>
                  <p className="text-gray-600">
                    Find trusted grooming services, book appointments, and manage your pet's grooming schedule with ease.
                  </p>
                </div>

                {/* Service Provider Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-furlink-blue hover:shadow-xl transition-shadow duration-300">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                      <span className="text-4xl">🏠</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-furlink-blue mb-4">service provider</h3>
                  <p className="text-gray-600">
                    Showcase your grooming business, manage bookings, and grow your customer base through our platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;