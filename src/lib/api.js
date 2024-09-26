// @ts-nocheck
import axios from "axios";

const API_BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = "CG-3RAEJs1QjTnV3enoksPN3Sy4";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-cg-demo-api-key": API_KEY,
    'Access-Control-Allow-Origin': '*',
  }
});

async function handleApiCall(apiCall) {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error('API call failed:', error.message);
    throw error;
  }
}

export function fetchCryptoCurrencies() {
  return handleApiCall(() => 
    axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      }
    })
  );
}

export function fetchHistorical(id) {
  return handleApiCall(() => 
    axiosInstance.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: "usd",
        days: 1
      }
    })
  );
}

export function fetchCryptoExtraInfo(id) {
  return handleApiCall(() => axiosInstance.get(`/coins/${id}`));
}