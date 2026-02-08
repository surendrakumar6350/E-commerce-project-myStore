"use client";

import { useState } from 'react';
import { Product } from '../page';
import Image from 'next/image';

interface ProductPreviewProps {
  product: Product;
  onClose: () => void;
}

export function ProductPreview({ product, onClose }: ProductPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-400">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Product Preview</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Close Preview
        </button>
      </div>
      
      {/* Preview Card */}
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Carousel */}
          <div className="relative">
            <div className="aspect-square relative bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                  >
                    ←
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                  >
                    →
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="p-6 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                {product.category}
              </span>
              {product.subCategory && (
                <span className="inline-block ml-2 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full capitalize">
                  {product.subCategory}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-lg font-medium text-gray-900">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>
            
            <div className="text-4xl font-bold text-green-600">
              Rs {product.price.toLocaleString()}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="space-y-3 pt-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Add to Cart
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors">
                Add to Wishlist
              </button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Product Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Product ID: #{product.id}</div>
                <div>Category: <span className="capitalize">{product.category}</span></div>
                {product.subCategory && (
                  <div>Subcategory: <span className="capitalize">{product.subCategory}</span></div>
                )}
                {Array.isArray(product.sizes) && product.sizes.length > 0 && (
                  <div>Sizes: {product.sizes.join(', ')}</div>
                )}
                <div>Average Rating: {product.rating}/5</div>
                <div>Total Reviews: {product.reviews.toLocaleString()}</div>
                <div>Total Images: {images.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-yellow-600">
            ℹ️
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Preview Note</h4>
            <p className="text-yellow-700 text-sm">
              This is how the product will appear to customers on the frontend. 
              The styling and layout may differ slightly based on the actual product card implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}