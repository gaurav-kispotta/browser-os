import type { EnhancedWiFiNetwork } from '../services/wifiService';
import type { NetworkInterface } from '../services/networkService';

export const MOCK_NETWORKS: EnhancedWiFiNetwork[] = [
  {
    ssid: 'Mock Home Network',
    signal: 90,
    signalDbm: -45,
    secure: true,
    connected: true,
    frequency: '5GHz',
    autoConnect: true,
    savedNetwork: true,
  },
  {
    ssid: 'Mock Office Network',
    signal: 75,
    signalDbm: -65,
    secure: true,
    frequency: '2.4GHz',
    savedNetwork: true,
  },
  {
    ssid: 'Mock Guest Network',
    signal: 60,
    signalDbm: -75,
    secure: false,
    frequency: '2.4GHz',
  },
  {
    ssid: 'Mock Public WiFi',
    signal: 45,
    signalDbm: -85,
    secure: false,
    frequency: '2.4GHz',
  },
  {
    ssid: 'Mock 5G Network',
    signal: 85,
    signalDbm: -55,
    secure: true,
    frequency: '5GHz',
  },
];

export const MOCK_LAN_INTERFACES: NetworkInterface[] = [
  {
    name: 'Ethernet 1',
    ip: '192.168.1.100',
    mac: '00:11:22:33:44:55',
    netmask: '255.255.255.0',
    gateway: '192.168.1.1',
    dhcp: true,
    active: true,
    type: 'Ethernet',
    speed: '1 Gbps',
    dns: ['8.8.8.8', '8.8.4.4'],
  },
  {
    name: 'Wi-Fi',
    ip: '192.168.1.101',
    mac: '66:77:88:99:AA:BB',
    netmask: '255.255.255.0',
    gateway: '192.168.1.1',
    dhcp: true,
    active: true,
    type: 'Wi-Fi',
    speed: '867 Mbps',
    dns: ['1.1.1.1', '1.0.0.1'],
  },
  {
    name: 'Docker0',
    ip: '172.17.0.1',
    mac: '02:42:30:4C:38:2E',
    netmask: '255.255.0.0',
    dhcp: false,
    active: true,
    type: 'Other',
  },
];
