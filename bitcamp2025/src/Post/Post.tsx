import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Post.css';

interface PostFormData {
  itemName: string;
  quantity: string;
  location: string;
  price: string;
  description: string;
  image: File | null;
}

const Post = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostFormData>({
    itemName: '',
    quantity: '',
    location: '',
    price: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    navigate('/');
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
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                ) : (
                  <label className="upload-label" htmlFor="image">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Click to upload or drag and drop</span>
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
              <input
                type="text"
                id="location"
                name="location"
                className="input"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                className="input"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
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

            <button type="submit" className="submit-btn">
              <i className="fas fa-paper-plane"></i>
              Post Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
