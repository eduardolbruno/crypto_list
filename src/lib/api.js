// @ts-nocheck
import axios from "axios";

const API_BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = "CG-3RAEJs1QjTnV3enoksPN3Sy4";

export async function fetchCryptoCurrencies() {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      headers: {
        "x-cg-demo-api-key": API_KEY,
        'Access-Control-Allow-Origin' : '*',
    },
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} id
 */
export async function fetchHistorical(id) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=1`, {
        headers: {
          "x-cg-demo-api-key": API_KEY,
          'Access-Control-Allow-Origin' : '*',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {string} id
 */
export async function fetchCryptoExtraInfo(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${id}`, {
        headers: {
          "x-cg-demo-api-key": API_KEY,
          'Access-Control-Allow-Origin' : '*',
        },
      });
    return response.data;
  } catch (error) {
    throw error;
  }
}
