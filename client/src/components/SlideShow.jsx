import React, { useState, useEffect } from "react";

const ImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // This effect now re-runs when the user manually clicks a dot (changing currentIndex),
  // which clears the old timer and starts a new 3-second timer.
  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    const timerId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3000ms = 3 seconds

    return () => clearInterval(timerId);
  }, [images.length, currentIndex]); // Add currentIndex to the dependency array

  if (images.length === 0) {
    return <div>Loading images...</div>;
  }

  const currentImage = images[currentIndex];

  // --- New Function ---
  // A simple handler to jump to a specific slide
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    // --- Container ---
    // Add 'relative' positioning to the main container
    <div className="relative mt-4 w-80 md:w-50 h-48 md:h-64 overflow-hidden rounded-lg shadow">
      {/* --- Image --- */}
      <img
        key={currentImage.id}
        src={currentImage.urls.small}
        alt={currentImage.alt_description}
        className="w-full h-full object-cover transition-opacity duration-500" // Added a simple transition
      />

      {/* --- Dots Container --- */}
      {/* This div overlays the dots at the bottom-center of the image */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            type="button"
            onClick={() => goToSlide(slideIndex)}
            // --- Dot Styling ---
            // Uses a ternary operator to change style for the active dot
            className={`
              w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300
              ${
                currentIndex === slideIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }
            `}
            // Add aria-label for accessibility
            aria-label={`Go to slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
