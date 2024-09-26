import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoCurrencies() {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}