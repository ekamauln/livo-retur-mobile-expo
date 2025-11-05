import {
  ChannelListResponse,
  CreateReturnRequest,
  CreateReturnResponse,
  FetchChannelsParams,
  FetchReturnsParams,
  FetchStoresParams,
  ReturnMobileResponse,
  StoreListResponse,
} from "./types";

const BASE_URL = "http://192.168.31.50:8081/api/mobile";

export const returnMobileApi = {
  async fetchReturns(
    params: FetchReturnsParams = {}
  ): Promise<ReturnMobileResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    const url = new URL(`${BASE_URL}/returns`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());
    if (search) {
      url.searchParams.append("search", search);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReturnMobileResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async createReturn(
    request: CreateReturnRequest
  ): Promise<CreateReturnResponse> {
    try {
      const response = await fetch(`${BASE_URL}/returns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateReturnResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchStores(
    params: FetchStoresParams = {}
  ): Promise<StoreListResponse> {
    const { search = "" } = params;

    const url = new URL(`${BASE_URL}/stores`);
    if (search) {
      url.searchParams.append("search", search);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StoreListResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchChannels(
    params: FetchChannelsParams = {}
  ): Promise<ChannelListResponse> {
    const { search = "" } = params;

    const url = new URL(`${BASE_URL}/channels`);
    if (search) {
      url.searchParams.append("search", search);
    }

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChannelListResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};
