import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
  type: string;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Styled components for each alert type
const WarningDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: '#fff3cd',
  color: '#856404',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& .MuiSvgIcon-root': {
    color: '#856404',
  }
}));

const ErrorDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: '#f8d7da',
  color: '#721c24',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& .MuiSvgIcon-root': {
    color: '#721c24',
  }
}));

const InfoDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: '#d1ecf1',
  color: '#0c5460',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '& .MuiSvgIcon-root': {
    color: '#0c5460',
  }
}));

const WarningButton = styled(Button)(() => ({
  color: '#856404',
  '&:hover': {
    backgroundColor: '#fff3cd',
  }
}));

const ErrorButton = styled(Button)(() => ({
  color: '#721c24',
  '&:hover': {
    backgroundColor: '#f8d7da',
  }
}));

const AlertModal = ({ type, title, content, onConfirm, onCancel }: Props) => {
  const handleConfirmClick = () => {
    console.log('Nút xác nhận trong AlertModal được nhấn');
    if (onConfirm) {
      console.log('Gọi hàm onConfirm');
      onConfirm();
    } else {
      console.log('Hàm onConfirm không được định nghĩa');
    }
  };

  const handleCancelClick = () => {
    console.log('Nút hủy trong AlertModal được nhấn');
    if (onCancel) {
      console.log('Gọi hàm onCancel');
      onCancel();
    } else {
      console.log('Hàm onCancel không được định nghĩa');
    }
  };

  const renderTitle = () => {
    switch (type) {
      case 'warning':
        return (
          <WarningDialogTitle id="alert-dialog-title">
            <WarningIcon />
            {title}
          </WarningDialogTitle>
        );
      case 'error':
        return (
          <ErrorDialogTitle id="alert-dialog-title">
            <ErrorIcon />
            {title}
          </ErrorDialogTitle>
        );
      default:
        return (
          <InfoDialogTitle id="alert-dialog-title">
            <InfoIcon />
            {title}
          </InfoDialogTitle>
        );
    }
  };

  const renderButtons = () => {
    switch (type) {
      case 'warning':
        return (
          <>
            <Button onClick={handleCancelClick} autoFocus>Hủy</Button>
            <WarningButton onClick={handleConfirmClick} variant="contained" 
              style={{ backgroundColor: '#ffc107' }}>
              Xác nhận
            </WarningButton>
          </>
        );
      case 'error':
        return (
          <>
            <Button onClick={handleCancelClick} autoFocus>Hủy</Button>
            <ErrorButton onClick={handleConfirmClick} variant="contained"
              style={{ backgroundColor: '#dc3545', color: 'white' }}>
              Xác nhận
            </ErrorButton>
          </>
        );
      default:
        return (
          <>
            <Button onClick={handleCancelClick} autoFocus>Hủy</Button>
            <Button onClick={handleConfirmClick} color="primary" variant="contained">
              Xác nhận
            </Button>
          </>
        );
    }
  };

  return (
    <Dialog
      open={true}
      onClose={handleCancelClick}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: '8px',
          boxShadow: type === 'error' ? '0px 4px 10px rgba(220, 53, 69, 0.25)' : 
                     type === 'warning' ? '0px 4px 10px rgba(236, 171, 5, 0.25)' : 
                     '0px 4px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }
      }}
    >
      {renderTitle()}
      <DialogContent>
        <DialogContentText id="alert-dialog-description"
          style={{
            color: type === 'error' ? '#721c24' : 
                  type === 'warning' ? '#856404' : 
                  '#0c5460',
            marginTop: '8px'
          }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {renderButtons()}
      </DialogActions>
    </Dialog>
  );
}

export default AlertModal;