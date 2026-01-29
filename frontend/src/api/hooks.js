import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from './axios';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('/products');
      return data || [];
    }
  });
};

export const useSalesReport = () => {
  return useQuery({
    queryKey: ['salesReport'],
    queryFn: async () => {
      const { data } = await axios.get('/sales/report');
      return data || { sales: [], totalRevenue: 0, totalProfit: 0 };
    }
  });
};

export const useStaff = () => {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data } = await axios.get('/auth/staff');
      return data || [];
    }
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data } = await axios.get('/dashboard/stats');
      return data;
    },
    staleTime: 60000, 
    refetchOnWindowFocus: false, 
  });
};