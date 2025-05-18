import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import os from 'os';

const execPromise = util.promisify(exec);

interface IPConfig {
  interface: string;
  ipAddress: string;
  netmask: string;
  gateway?: string;
  dns?: string[];
  dhcp: boolean;
}

// Function to get current network configurations
async function getCurrentNetworkConfig() {
  try {
    const networkInterfaces = os.networkInterfaces();
    const interfaces: IPConfig[] = [];

    for (const [name, ifaceDetails] of Object.entries(networkInterfaces)) {
      if (!ifaceDetails) continue;

      for (const iface of ifaceDetails) {
        if (iface.family === 'IPv4') {
          // Try to get gateway and DNS information (Linux specific)
          let gateway = '';
          let dhcp = true;
          let dns: string[] = [];
          
          try {
            // Get gateway information using ip route command
            const { stdout: routeOutput } = await execPromise('ip route | grep default');
            const gatewayMatch = routeOutput.match(/default via ([0-9.]+)/);
            if (gatewayMatch && gatewayMatch[1]) {
              gateway = gatewayMatch[1];
            }
            
            // Check if interface is using DHCP
            const { stdout: dhcpOutput } = await execPromise(`cat /etc/network/interfaces | grep -i ${name} -A 10 | grep -i "dhcp"`);
            dhcp = dhcpOutput.trim().length > 0;
            
            // Get DNS servers
            const { stdout: dnsOutput } = await execPromise('cat /etc/resolv.conf | grep nameserver');
            dns = dnsOutput
              .split('\n')
              .filter(line => line.includes('nameserver'))
              .map(line => line.replace('nameserver', '').trim());
          } catch (error) {
            console.warn('Error getting additional network details:', error);
          }

          interfaces.push({
            interface: name,
            ipAddress: iface.address,
            netmask: iface.netmask,
            gateway,
            dns,
            dhcp
          });
        }
      }
    }

    return interfaces;
  } catch (error) {
    console.error('Error getting network configuration:', error);
    throw error;
  }
}

// Function to update network configuration
async function updateNetworkConfig(config: IPConfig) {
  try {
    const { interface: iface, ipAddress, netmask, gateway, dhcp, dns } = config;
    
    if (dhcp) {
      // Configure interface to use DHCP
      await execPromise(`sudo sed -i '/iface ${iface}/,/^$/c\\iface ${iface} inet dhcp\\n\\n' /etc/network/interfaces`);
    } else {
      // Configure interface to use static IP
      const staticConfig = `iface ${iface} inet static
  address ${ipAddress}
  netmask ${netmask}
  ${gateway ? `gateway ${gateway}` : ''}
`;
      await execPromise(`sudo sed -i '/iface ${iface}/,/^$/c\\${staticConfig}\\n' /etc/network/interfaces`);
    }
    
    // Update DNS servers if provided
    if (dns && dns.length > 0) {
      const dnsConfig = dns.map(server => `nameserver ${server}`).join('\n');
      await execPromise(`sudo sh -c 'echo "${dnsConfig}" > /etc/resolv.conf'`);
    }
    
    // Restart networking to apply changes
    await execPromise('sudo systemctl restart networking');
    
    return { success: true, message: 'IP configuration updated successfully' };
  } catch (error) {
    console.error('Error updating network configuration:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const interfaces = await getCurrentNetworkConfig();
    return NextResponse.json({ interfaces });
  } catch (error) {
    console.error('Error getting IP configurations:', error);
    return NextResponse.json({ 
      interfaces: [],
      error: 'Failed to get IP configurations'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    const result = await updateNetworkConfig(config);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating IP configuration:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update IP configuration' 
    }, { status: 500 });
  }
}
