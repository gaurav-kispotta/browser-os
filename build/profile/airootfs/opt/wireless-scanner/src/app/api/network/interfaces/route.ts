import { NextResponse } from 'next/server';
import os from 'os';
import { NetworkInterface } from '@/services/networkService';

function getNetworkType(name: string): NetworkInterface['type'] {
  name = name.toLowerCase();
  if (name.includes('ethernet') || name.includes('eth')) return 'Ethernet';
  if (name.includes('wi-fi') || name.includes('wlan')) return 'Wi-Fi';
  return 'Other';
}

export async function GET() {
  try {
    const networkInterfaces = os.networkInterfaces();
    const interfaces: NetworkInterface[] = [];

    for (const [name, addrs] of Object.entries(networkInterfaces)) {
      if (!addrs) continue;

      const ipv4Addr = addrs.find(addr => addr.family === 'IPv4');
      if (ipv4Addr) {
        interfaces.push({
          name,
          ip: ipv4Addr.address,
          mac: ipv4Addr.mac,
          netmask: ipv4Addr.netmask,
          dhcp: true, // This would need to be determined by the system
          active: !ipv4Addr.internal,
          type: getNetworkType(name),
          // These would need to be determined by the system
          gateway: undefined,
          speed: undefined,
          dns: undefined
        });
      }
    }

    return NextResponse.json(interfaces);
  } catch (error) {
    console.error('Failed to get network interfaces:', error);
    return NextResponse.json(
      { error: 'Failed to get network interfaces' },
      { status: 500 }
    );
  }
}
