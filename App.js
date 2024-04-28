import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="#" className="text-white text-2xl font-bold">The Power Room</a>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Share</a>
              <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Tweet</a>
              <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <div className="relative bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">Feel The Power</h1>
          <p className="mt-4 text-xl text-gray-300">Welcome to The Power Room. We are a fitness and training center that focuses on pushing you to your absolute limit. Download our complete brochure to get started today!</p>
          <a href="#" className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg">Download Brochure</a>
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="bg-gray-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Safe Body Building</h2>
            <p className="text-lg">The extension comes with three pre-built pages to help you get started faster. You can change the text and images and you're good to go.</p>
          </div>
          <div className="max-w-md">
            <img src="https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" alt="About Us" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      {/* Add more sections/components as needed */}
    </div>
  );
}

export default App;
