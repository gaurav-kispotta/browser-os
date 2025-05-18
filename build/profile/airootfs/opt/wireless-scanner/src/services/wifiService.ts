import type { WiFiNetwork } from 'node-wifi';
import { MOCK_NETWORKS } from '../utils/mockData';
import { config, networkDelays } from '../utils/env';

export interface EnhancedWiFiNetwork {
  ssid: string;
  signal: number;
  signalDbm: number;
  secure: boolean;
  connected?: boolean;
  frequency: '2.4GHz' | '5GHz';
  autoConnect?: boolean;
  metered?: boolean;
  savedNetwork?: boolean;
}

function convertToEnhancedNetwork(network: WiFiNetwork & { current?: boolean }): EnhancedWiFiNetwork {
  return {
    ssid: network.ssid,
    signal: Math.min(100, Math.max(0, Math.abs(network.signal_level) * 2)),
    signalDbm: network.signal_level,
    secure: network.security !== 'NONE' && network.security !== '',
    connected: network.current,
    frequency: network.frequency > 5000 ? '5GHz' : '2.4GHz',
    savedNetwork: false,
    autoConnect: false
  };
}

// Mock functions for integration testing
function getMockNetworks(): Promise<EnhancedWiFiNetwork[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_NETWORKS);
    }, networkDelays.scan);
  });
}

function mockConnectToWifi(ssid: string, password?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate connection success/failure based on password
      if (password === 'wrongpassword') {
        reject(new Error('Authentication failed'));
        return;
      }
      resolve();
    }, networkDelays.connect);
  });
}

function mockForgetNetwork(ssid: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, networkDelays.forget);
  });
}

export async function scanNetworks(): Promise<EnhancedWiFiNetwork[]> {
  if (config.isIntegrationTest) {
    return getMockNetworks();
  }

  try {
    const response = await fetch('/api/wifi', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to scan networks');
    }

    const networks: (WiFiNetwork & { current?: boolean })[] = await response.json();
    return networks.map(convertToEnhancedNetwork);
  } catch (error) {
    console.error('Error scanning networks:', error);
    throw error;
  }
}

export async function connectToWifi(ssid: string, password?: string): Promise<void> {
  if (config.isIntegrationTest) {
    return mockConnectToWifi(ssid, password);
  }

  try {
    const response = await fetch('/api/wifi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssid, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to connect to network');
    }
  } catch (error) {
    console.error('Error connecting to network:', error);
    throw error;
  }
}

export async function forgetNetwork(ssid: string): Promise<void> {
  if (config.isIntegrationTest) {
    return mockForgetNetwork(ssid);
  }

  try {
    const response = await fetch('/api/wifi', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ssid }),
    });

    if (!response.ok) {
      throw new Error('Failed to forget network');
    }
  } catch (error) {
    console.error('Error forgetting network:', error);
    throw error;
  }
}
