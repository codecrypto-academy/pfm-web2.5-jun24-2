import { useState, useCallback } from 'react';

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const requestConfirm = useCallback((confirmAction) => {
    setIsOpen(true);
    setOnConfirm(() => () => {
      confirmAction();
      setIsOpen(false); // Cierra el diálogo automáticamente tras confirmar
    });
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    onConfirm,
    requestConfirm,
    cancel
  };
};

export default useConfirm;
