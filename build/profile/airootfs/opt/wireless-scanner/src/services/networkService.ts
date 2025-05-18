import { config, networkDelays } from '../utils/env';
import { MOCK_LAN_INTERFACES } from '../utils/mockData';

export interface NetworkInterface {
  name: string;
  ip: string;
  mac: string;
  netmask: string;
  gateway?: string;
  dhcp: boolean;
  active: boolean;
  type: 'Ethernet' | 'Wi-Fi' | 'Other';
  speed?: string;
  dns?: string[];
}

export async function scanLocalNetworks(): Promise<NetworkInterface[]> {
  if (config.isIntegrationTest) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LAN_INTERFACES);
      }, networkDelays.scan);
    });
  }

  try {
    const response = await fetch('/api/network/interfaces');
    if (!response.ok) {
      throw new Error('Failed to fetch network interfaces');
    }
    const interfaces: NetworkInterface[] = await response.json();
    return interfaces;
  } catch (error) {
    console.error('Error scanning network interfaces:', error);
    throw error;
  }
}
