import React, { useState, useEffect } from "react";
import "./Gallery.css";

const images = [
  { src: "/images/16.png", caption: "Chole Bhature" },
  { src: "/images/17.png", caption: "Idli Sambhar" },
  { src: "/images/18.png", caption: "Dosa, Sambhar And Chutney" },
  { src: "/images/19.png", caption: "Shahi Paneer" },
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000); // Auto-slide every 5s
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Our Delicacies</h2>
      <div
        className="slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {images.map((image, index) => {
          const position =
            (index - currentIndex + images.length) % images.length;
          return (
            <div
              key={index}
              className={`slide-card slide-${position}`}
            >
              <img src={image.src} alt={`Gallery ${index + 1}`} />
              <div className="caption">{image.caption}</div>
            </div>
          );
        })}
        <button className="arrow left-arrow" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="arrow right-arrow" onClick={nextSlide}>
          &#10095;
        </button>

        {/* Bullet Indicators */}
        <div className="indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
