"use client";

import { useState, useEffect } from "react";
import { ProductList } from "./components/ProductList";
import { AddProduct } from "./components/AddProduct";
import { EditProduct } from "./components/EditProduct";
import { ProductPreview } from "./components/ProductPreview";
import { Sidebar } from "./components/Sidebar";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  description: string;
  image: string;
  images: string[];
  sizes?: string[];
  rating: number;
  reviews: number;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'preview'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load from database on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        if (active && Array.isArray(data.products)) {
          setProducts(data.products as Product[]);
        }
      } catch (err) {
        console.error('Failed to load products from DB', err);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    // Optimistically update UI
    setProducts([...products, product]);
    setCurrentView('list');

    // Persist to database (fire-and-forget)
    void fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('Failed to save product:', data?.error || res.statusText);
      }
    }).catch((err) => {
      console.error('Network error saving product:', err);
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    // Optimistic update
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setSelectedProduct(null);
    setCurrentView('list');

    // Persist to database
    void fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        category: updatedProduct.category,
        subCategory: updatedProduct.subCategory,
        description: updatedProduct.description,
        image: updatedProduct.image,
        images: updatedProduct.images,
        sizes: updatedProduct.sizes,
        rating: updatedProduct.rating,
        reviews: updatedProduct.reviews,
      })
    }).then(async (res) => {
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('Failed to update product:', data?.error || res.statusText);
      }
    }).catch((err) => {
      console.error('Network error updating product:', err);
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // Optimistic removal
      setProducts(products.filter(p => p.id !== id));

      // Persist deletion to database
      void fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            console.error('Failed to delete product:', data?.error || res.statusText);
          }
        })
        .catch((err) => {
          console.error('Network error deleting product:', err);
        });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('edit');
  };

  const handlePreviewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('preview');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          setSelectedProduct={setSelectedProduct}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {currentView === 'list' && (
              <ProductList
                products={filteredProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onPreview={handlePreviewProduct}
              />
            )}
            
            {currentView === 'add' && (
              <AddProduct
                onAdd={handleAddProduct}
                onCancel={() => setCurrentView('list')}
              />
            )}
            
            {currentView === 'edit' && selectedProduct && (
              <EditProduct
                product={selectedProduct}
                onUpdate={handleUpdateProduct}
                onCancel={() => {
                  setSelectedProduct(null);
                  setCurrentView('list');
                }}
              />
            )}
            
            {currentView === 'preview' && selectedProduct && (
              <ProductPreview
                product={selectedProduct}
                onClose={() => {
                  setSelectedProduct(null);
                  setCurrentView('list');
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}