import React, { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  category: 'food' | 'interior';
  span?: string; // class for grid span
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Handle body scroll locking
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImageIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left -> Next image
      if (selectedImageIndex !== null) {
        setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    }
    
    if (isRightSwipe) {
      // Swipe right -> Prev image
      if (selectedImageIndex !== null) {
        setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
    }
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };
  
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, images.length]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`group relative overflow-hidden cursor-pointer rounded-sm ${image.span || ''}`}
            onClick={() => openModal(index)}
            role="button"
            aria-label={`View full size image: ${image.alt}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openModal(index);
            }}
          >
            <div className="aspect-[4/3] w-full h-full bg-charcoal/5">
                <img 
                src={image.src} 
                alt={image.alt} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-alabaster bg-charcoal/80 px-4 py-2 text-xs uppercase tracking-widest rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    View
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div 
          className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={handleModalClick}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
          tabIndex={-1}
          onKeyDown={(e) => e.key === 'Escape' && closeModal()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <button 
            className="absolute top-4 right-4 text-alabaster/60 hover:text-alabaster p-2 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-alabaster/50 rounded-full"
            onClick={closeModal}
            aria-label="Close gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-alabaster/60 hover:text-alabaster p-2 transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-alabaster/50 rounded-full"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="max-w-5xl max-h-[85vh] relative">
            <img 
              src={images[selectedImageIndex].src}  
              alt={images[selectedImageIndex].alt} 
              className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm"
            />
            <div className="mt-4 text-center">
              <p className="text-alabaster/80 font-serif text-lg tracking-wide">{images[selectedImageIndex].alt}</p>
              <p className="text-alabaster/40 text-xs uppercase tracking-widest mt-1">
                {selectedImageIndex + 1} of {images.length}
              </p>
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-alabaster/60 hover:text-alabaster p-2 transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-alabaster/50 rounded-full"
            onClick={nextImage}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}