import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
    position: { top: number; left: number };
}

const Modal = ({ onClose, children, position }: ModalProps) => {
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const modalContent = document.getElementById('modal-content');
            if (modalContent && !modalContent.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [onClose]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50">
            <div
                id="modal-content"
                className="bg-white rounded-lg shadow-lg p-4 relative"
                style={{ position: 'absolute', top: position.top, left: position.left }}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;