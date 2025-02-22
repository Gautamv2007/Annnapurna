import React, { useState, useEffect } from "react";
import './Slider.css';

const Navbar = () => {
  const images = [
    { url: '/images/1.jpg', name: 'Top View of Dining Hall' },
    { url: '/images/2.jpg', name: 'Hill Top Dining Hall' },
    { url: '/images/3.jpg', name: 'Akshaya Dining Hall' },
    { url: '/images/4.png', name: 'Corridor Connecting Old and New Hall' },
    { url: '/images/5.png', name: 'Senior\'s Mess' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="container">
      <div className="slide">
        {images.map((image, index) => (
          <div
            key={index}
            className={`item ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${process.env.PUBLIC_URL + image.url})`,
              transform: `translateX(${(index - currentIndex) * 100}%)`
            }}
          >
            <div className="content">
              <div className="name">{image.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="button">
        <button className="prev" onClick={goToPrev}>
          &lt;
        </button>
        <button className="next" onClick={goToNext}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Navbar;
