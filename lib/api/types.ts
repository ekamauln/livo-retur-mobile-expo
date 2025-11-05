export interface Channel {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ReturnMobile {
  id: number;
  tracking: string;
  channel_id: number;
  store_id: number;
  created_at: string;
  updated_at: string;
  channel: Channel;
  store: Store;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ReturnMobileData {
  return_mobiles: ReturnMobile[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ReturnMobileResponse = ApiResponse<ReturnMobileData>;

export interface FetchReturnsParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Create Return types
export interface CreateReturnRequest {
  channel_id: number;
  store_id: number;
  tracking: string;
}

export interface CreateReturnResponse {
  success: boolean;
  message: string;
  data: ReturnMobile;
}

// Store and Channel list responses
export interface StoreData {
  stores: Store[];
}

export interface ChannelData {
  channels: Channel[];
}

export type StoreListResponse = ApiResponse<StoreData>;
export type ChannelListResponse = ApiResponse<ChannelData>;

export interface FetchStoresParams {
  search?: string;
}

export interface FetchChannelsParams {
  search?: string;
}