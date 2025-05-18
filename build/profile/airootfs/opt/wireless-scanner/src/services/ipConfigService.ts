import { NetworkInterface } from './networkService';

export interface IPConfig {
  interface: string;
  ipAddress: string;
  netmask: string;
  gateway?: string;
  dns?: string[];
  dhcp: boolean;
}

export async function getIPConfig(): Promise<IPConfig[]> {
  try {
    const response = await fetch('/api/system/ip/config');
    if (!response.ok) {
      throw new Error('Failed to fetch IP configurations');
    }
    const data = await response.json();
    return data.interfaces;
  } catch (error) {
    console.error('Error getting IP configurations:', error);
    throw error;
  }
}

export async function updateIPConfig(config: IPConfig): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/system/ip/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating IP configuration:', error);
    return { success: false, message: 'Failed to update IP configuration' };
  }
}
