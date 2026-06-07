import React from 'react';
import Modal from '../common/Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  titulo: string;
  descripcion: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'peligro';
  cargando?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  titulo,
  descripcion,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  cargando,
}) => {
  // cargando no se usa pero se acepta como parámetro
  void cargando;
  return (
    <Modal
      isOpen={isOpen}
      titulo={titulo}
      descripcion={descripcion}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText={confirmText}
      cancelText={cancelText}
      variant={variant}
    />
  );
};

export default ConfirmDialog;
