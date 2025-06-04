import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import './ImageGallery.css';
import AlertModal from '../AlertModal/AlertModal';
import { SERVER_URL } from '@renderer/Api';

interface Image {
  id: number;
  url: string;
}

interface Props {
  personId: number;
  code?: string;
}

const ImageGallery = ({ personId, code }: Props) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API và parse kết quả về JSON
        const response = await fetch(`${SERVER_URL}/api/person/images/${personId}`);
        const data = await response.json(); // [{ id: 1, url: "meeee.jpg" }, ...]

        setImages(data || []);
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
    if (fileInputRef.current && !uploading) {
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
      formData.append('file', files[i]);
    }

    try {
      setUploading(true);
      setError(null);

      const response = await fetch(`${SERVER_URL}/api/person/face/upload`, {
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
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
  };

  const handleReplaceImage = () => {
    if (selectedImageIndex === null) return;
    alert('Chức năng thay thế ảnh chưa được triển khai. Vui lòng thêm API backend.');
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteAlert(false);

    if (imageToDelete === null) return;

    const image = images[imageToDelete];

    try {
      const response = await fetch(`${SERVER_URL}/delete-image/${image.url}?personId=${personId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        const updatedImages = images.filter((_, idx) => idx !== imageToDelete);
        setImages(updatedImages);
        setSelectedImageIndex(null);
        setImageToDelete(null);
      } else {
        throw new Error(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Lỗi khi xóa ảnh: ', error);
      setError('Không thể xóa ảnh. Vui lòng thử lại.');
    }
  };

  const handleDeleteClick = () => {
    if (selectedImageIndex !== null) {
      setImageToDelete(selectedImageIndex);
      setShowDeleteAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setShowDeleteAlert(false);
    setImageToDelete(null);
  };

  return (
    <div className="image-gallery-container">
      <div className="gallery-header">
        <div className="header-content">
          <ImageIcon className="header-icon" />
          <h1 className="gallery-title">Ảnh nhận diện</h1>
        </div>
        <div className="gallery-stats">
          {images.length} ảnh
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      <div className="gallery-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải ảnh...</p>
          </div>
        ) : (
          <div className="image-grid">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={index}
                  // className={`image-card ${selectedImageIndex === index ? 'selected' : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <div className="image-wrapper">
                    <img
                      src={`${SERVER_URL}/face/${image.url}`}
                      alt={`Image ${index + 1}`}
                      className="gallery-image"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="image-overlay">
                      {selectedImageIndex === index && (
                        <div className="overlay-actions">
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick();
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            className="action-btn replace-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplaceImage();
                            }}
                          >
                            <RefreshCw size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <ImageIcon className="empty-icon" />
                <h3>Chưa có ảnh nào</h3>
                <p>Thêm ảnh đầu tiên để bắt đầu nhận diện</p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="file-input"
        onChange={handleFileChange}
      />

      <button
        className={`add-image-fab ${uploading ? 'uploading' : ''}`}
        onClick={handleAddImageClick}
        disabled={uploading}
      >
        {uploading ? (
          <div className="upload-spinner"></div>
        ) : (
          <Plus size={24} />
        )}
      </button>

      {showDeleteAlert && (
        <AlertModal
          type="warning"
          title="Xác nhận xóa"
          content="Bạn có chắc chắn muốn xóa ảnh này không?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleCloseAlert}
        />
      )}
    </div>
  );
};

export default ImageGallery;