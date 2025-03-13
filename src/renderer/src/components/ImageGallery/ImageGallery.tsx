import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button'
import './ImageGallery.css';

interface Image {
  link: string;
}

interface Props {
  personId: number;
  code?: string;
}

const ImageGallery = ({ personId , code}: Props) => {
  const BaseURL = 'http://localhost:8000'; // Đường dẫn gốc đến Flask server
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // Theo dõi ảnh được chọn

  console.log(code)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        setError(null);   // Reset lỗi
        const fetchedImages = await window.db.getImages(personId);
        setImages(fetchedImages || []); 
      } catch (error) {
        console.error('Error fetching images: ', error);
        setError('Không thể tải ảnh. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [personId]);

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('personid', personId.toString()); 
    formData.append('code', code || 'default-code'); 
    for (let i = 0; i < files.length; i++) {
      formData.append('filenames', files[i]); 
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BaseURL}/add-images`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();
      console.log(result);

    } catch (error) {
      console.error('Error uploading images: ', error);
      setError('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      const fetchedImages = await window.db.getImages(personId);
      setImages(fetchedImages || []);
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input file
      }
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index)
  }

  const handleReplaceImage = () => {
    if (selectedImageIndex === null) return;
    alert('Chức năng thay thế ảnh chưa được triển khai. Vui lòng thêm API backend.');
  };


  const handleDeleteImage = async () => {
    if (selectedImageIndex === null) return;
  
    const image = images[selectedImageIndex];
  
    try {
      const response = await fetch(`${BaseURL}/delete-image/${image.link}?personId=${personId}`, {
        method: 'DELETE',
      });
  
      const result = await response.json(); // Đọc phản hồi JSON
      if (response.ok) {
        const updatedImages = images.filter((_, idx) => idx !== selectedImageIndex);
        setImages(updatedImages);
        setSelectedImageIndex(null);
        console.log('Image deleted successfully');
      } else {
        throw new Error(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image: ', error);
      setError('Không thể xóa ảnh. Vui lòng thử lại.');
    }
  };

  return (
    <div className="profile-details">
      <h2 className="detail-title">Ảnh nhận diện</h2>
      {loading ? (
        <p>Đang tải ảnh...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="image-gallery">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="image-container" onClick={() => handleImageClick(index)}>
                <img
                  src={`${BaseURL}/face/${image.link}`}
                  alt={`Image ${index + 1}`}
                  className="gallery-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {selectedImageIndex === index && (
                  <div className="image-overlay">
                    <Button className='delete-button' onClick={handleDeleteImage}>Xóa</Button>
                    <Button onClick={handleReplaceImage}>Thay đổi</Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="avatar-placeholder">Không có ảnh</div>
          )}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }} // Ẩn input file
        onChange={handleFileChange}
      />
      <button className="add-image-button" onClick={handleAddImageClick}>
        Thêm ảnh
      </button>
    </div>
  );
};

export default ImageGallery;