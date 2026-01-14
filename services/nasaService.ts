
import { NASAData } from '../types';


const API_KEY = 'REDACTED_API_KEY'; 
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

export const fetchAPOD = async (date: string): Promise<NASAData> => {
  const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Failed to fetch from NASA');
  }
  return response.json();
};

/**
 * Normalizes a birth date to a valid NASA APOD date.
 * NASA APOD started on June 16, 1995.
 */
export const getValidDate = (birthDateStr: string): string => {
  const birthDate = new Date(birthDateStr);
  const minDate = new Date('1995-06-16');
  const now = new Date();
  
  // If the birthday is after APOD started, we can use the actual birth year.
  if (birthDate >= minDate && birthDate <= now) {
    return birthDateStr;
  }
  
  // If birthday is before 1995 or in the future, use the birthday but with year 2023.
  const month = String(birthDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(birthDate.getUTCDate()).padStart(2, '0');
  return `2023-${month}-${day}`;
};
