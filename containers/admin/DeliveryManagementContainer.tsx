'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DeliveryManagementView } from '@/views/admin/DeliveryManagementView';
import { getAdminShipments, deleteShipment } from '@/lib/api/shipments';
import { getCarriers } from '@/lib/api/carriers';
import { Shipment, Carrier } from '@/types';
import { toast } from 'sonner';

export const DeliveryManagementContainer = () => {
  const [shipments, setShipments] = useState<(Shipment & { carrier: Carrier })[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isManualRegisterDialogOpen, setIsManualRegisterDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const fetchShipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminShipments(pagination.page, pagination.limit, searchTerm);
      setShipments(data.shipments);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Fetch shipments error:', error);
      toast.error('배송 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm]);

  const fetchCarriers = useCallback(async () => {
    try {
      const data = await getCarriers();
      setCarriers(data.carriers);
    } catch (error) {
      console.error('Fetch carriers error:', error);
      toast.error('택배사 목록을 불러오는데 실패했습니다');
    }
  }, []);

  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedShipment) return;

    try {
      await deleteShipment(selectedShipment.id);
      toast.success('배송 정보가 삭제되었습니다');
      setSelectedShipment(null);
      setIsDeleteOpen(false);
      fetchShipments();
    } catch (error) {
      console.error('Delete shipment error:', error);
      toast.error('삭제 중 오류가 발생했습니다');
    }
  };

  const handleSuccess = () => {
    fetchShipments();
  };

  return (
    <DeliveryManagementView
      shipments={shipments}
      carriers={carriers}
      searchTerm={searchTerm}
      isLoading={isLoading}
      pagination={pagination}
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
      onSuccess={handleSuccess}
    />
  );
};
