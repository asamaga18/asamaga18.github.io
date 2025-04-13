
import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Sidebar from '../components/Sidebar';
import './Post.css';

interface PostFormData {
  itemName: string;
  category: string;
  quantity: string;
  location: string;
  price: string;
  description: string;
  image: File | null;
}

const types = [
  { value: 'Request', label: 'Request' },
  { value: 'Sell', label: 'Sell' }
];

const Post = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostFormData>({
    itemName: '',
    category: '',
    quantity: '',
    location: '',
    price: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (selectedOption: any) => {
    setFormData(prev => ({
      ...prev,
      postType: selectedOption.value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = {
      item_name: formData.itemName,
      category: formData.category,
      quantity: formData.quantity,
      location: formData.location,
      price: formData.price,
      description: formData.description,
      image_url: imagePreview || ''
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", res.status, errorText);
        alert("Post submission failed.");
        return;
      }

      navigate('/browse');
    } catch (err) {
      console.error(err);
      alert('Error posting item.');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <div className="post-container">
          <h1 className="post-title">Create a New Post</h1>
          <form className="post-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="image">Upload Image</label>
              <div className="image-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                ) : (
                  <label className="upload-label" htmlFor="image">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span id="clicktoupload">Click to upload or drag and drop</span>
                  </label>
                )}
                <input
                  type="file"
                  id="image"
                  className="file-input"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="Request">Do you have a request or anything to sell?</label>
              <select
                id="request"
                name="request"
                className="input"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an Option</option>
                <option value="Request">Request</option>
                <option value="Sell">Sell</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="itemName">Item Name</label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                className="input"
                value={formData.itemName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="input"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Canned">Canned</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="input"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                className="input"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a Town</option>
                <option value="University Park">University Park, MD</option>
                <option value="College Park">College Park, MD</option>
                <option value="Hyattsville">Hyattsville, MD</option>
                <option value="Riverdale Park">Riverdale Park, MD</option>
                <option value="Greenbelt">Greenbelt, MD</option>
                <option value="Adelphi">Adelphi, MD</option>
                <option value="Beltsville">Beltsville, MD</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <div className="price-input-wrapper">
                <span className="dollar-sign">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="input"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="textarea"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="button-wrapper">
              <button className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Post Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
