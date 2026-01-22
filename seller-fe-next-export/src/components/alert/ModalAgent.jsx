'use client';

import useModal from '@/hooks/useModal';
import { CustomModal, AlertModal, ConfirmModal } from '@/components';

const ModalAgent = () => {
  const { modal } = useModal();
  if (modal.type === 'alert') {
    return <AlertModal />;
  } else if (modal.type === 'custom') {
    return <CustomModal />;
  } else {
    return <ConfirmModal />;
  }
};

export default ModalAgent;
