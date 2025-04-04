import { Event } from "@/lib/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface ModalContextType {
  eventModalOpen: boolean;
  bookingModalOpen: boolean;
  successModalOpen: boolean;
  selectedEvent: Event | null;
  openEventModal: (event: Event) => void;
  closeEventModal: () => void;
  openBookingModal: (event: Event) => void;
  closeBookingModal: () => void;
  openSuccessModal: () => void;
  closeSuccessModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setEventModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeEventModal = () => {
    setEventModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  const openBookingModal = (event: Event) => {
    setSelectedEvent(event);
    setBookingModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeBookingModal = () => {
    setBookingModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  const openSuccessModal = () => {
    setSuccessModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <ModalContext.Provider 
      value={{
        eventModalOpen,
        bookingModalOpen,
        successModalOpen,
        selectedEvent,
        openEventModal,
        closeEventModal,
        openBookingModal,
        closeBookingModal,
        openSuccessModal,
        closeSuccessModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalProvider");
  }
  return context;
}
