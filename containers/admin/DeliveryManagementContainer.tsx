'use client';

import React, { useState } from 'react';
import { DeliveryManagementView } from '@/views/admin/DeliveryManagementView';
import { MOCK_SHIPMENTS, MOCK_CARRIERS } from '@/data/mocks/shipments';
import { Shipment } from '@/types';

export const DeliveryManagementContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isManualRegisterDialogOpen, setIsManualRegisterDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Client-side filtering
  const filteredShipments = MOCK_SHIPMENTS.filter((shipment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      shipment.recipient_name.toLowerCase().includes(searchLower) ||
      shipment.recipient_phone_full.includes(searchLower) ||
      shipment.tracking_number.includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, we would delete the shipment here
    console.log('Deleting shipment:', selectedShipment);
    setSelectedShipment(null);
  };

  return (
    <DeliveryManagementView
      shipments={filteredShipments}
      carriers={MOCK_CARRIERS}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      isUploadDialogOpen={isUploadDialogOpen}
      setIsUploadDialogOpen={setIsUploadDialogOpen}
      isManualRegisterDialogOpen={isManualRegisterDialogOpen}
      setIsManualRegisterDialogOpen={setIsManualRegisterDialogOpen}
      isEditOpen={isEditOpen}
      setIsEditOpen={setIsEditOpen}
      isDeleteOpen={isDeleteOpen}
      setIsDeleteOpen={setIsDeleteOpen}
      selectedShipment={selectedShipment}
      onEditClick={handleEditClick}
      onDeleteClick={handleDeleteClick}
      onDeleteConfirm={handleDeleteConfirm}
    />
  );
};
