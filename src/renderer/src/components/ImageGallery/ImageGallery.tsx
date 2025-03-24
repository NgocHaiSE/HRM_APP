import { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button/Button'
import './ImageGallery.css';
import AlertModal from '../AlertModal/AlertModal';

interface Image {
  link: string;
}

interface Props {
  personId: number;
  code?: string;
}

const ImageGallery = ({ personId, code }: Props) => {
  const BaseURL = 'http://localhost:8000'; 
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // Theo dõi ảnh được chọn
  const [imageToDelete, setImageToDelete] = useState<number | null>(null); // Lưu index của ảnh cần xóa
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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
    setSelectedImageIndex(index === selectedImageIndex ? null : index);
  };

  const handleReplaceImage = () => {
    if (selectedImageIndex === null) return;
    alert('Chức năng thay thế ảnh chưa được triển khai. Vui lòng thêm API backend.');
  };

  const handleDeleteConfirm = async () => {
    console.log('handleDeleteConfirm được gọi, imageToDelete:', imageToDelete);
    // Đóng Alert trước khi thực hiện xóa
    setShowDeleteAlert(false);
    
    if (imageToDelete === null) {
      console.log('Không có ảnh nào được chọn để xóa');
      return;
    }
  
    const image = images[imageToDelete];
    console.log('Đang xóa ảnh:', image.link);
  
    try {
      const response = await fetch(`${BaseURL}/delete-image/${image.link}?personId=${personId}`, {
        method: 'DELETE',
      });
  
      const result = await response.json(); // Đọc phản hồi JSON
      console.log('Kết quả API:', result);
      
      if (response.ok) {
        const updatedImages = images.filter((_, idx) => idx !== imageToDelete);
        setImages(updatedImages);
        setSelectedImageIndex(null);
        setImageToDelete(null);
        console.log('Xóa ảnh thành công');
      } else {
        throw new Error(result.error || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Lỗi khi xóa ảnh: ', error);
      setError('Không thể xóa ảnh. Vui lòng thử lại.');
    }
  };

  const handleDeleteClick = () => {
    console.log('Nút xóa được nhấn, hiển thị alert');
    if (selectedImageIndex !== null) {
      setImageToDelete(selectedImageIndex); // Lưu index của ảnh cần xóa
      setShowDeleteAlert(true);
    } else {
      console.log('Không có ảnh nào được chọn để xóa');
    }
  };

  const handleCloseAlert = () => {
    console.log('Đóng alert');
    setShowDeleteAlert(false);
    setImageToDelete(null); // Reset lại giá trị khi đóng alert
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
                    <Button className='delete-button' 
                      onClick={handleDeleteClick}
                    >
                      Xóa
                    </Button>
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