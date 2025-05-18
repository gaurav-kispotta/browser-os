import { NextRequest, NextResponse } from 'next/server';
import wifi, { WiFiNetwork } from 'node-wifi';

interface ConnectRequestBody {
  ssid: string;
  password?: string;
}

interface DeleteRequestBody {
  ssid: string;
}

interface EnhancedWiFiNetwork extends WiFiNetwork {
  current?: boolean;
}

// Initialize wifi module
wifi.init({
  iface: null // use the first available WiFi interface
});

export async function GET() {
  try {
    const networks = await wifi.scan();
    const currentConnections = await wifi.getCurrentConnections();
    
    // Merge scan results with current connection information
    const enhancedNetworks = networks.map((network): EnhancedWiFiNetwork => ({
      ...network,
      current: currentConnections.some(conn => conn.ssid === network.ssid)
    }));
    
    return NextResponse.json(enhancedNetworks);
  } catch (error) {
    console.error('Failed to scan networks:', error);
    return NextResponse.json(
      { error: 'Failed to scan networks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ConnectRequestBody = await request.json();
    
    await wifi.connect({
      ssid: body.ssid,
      password: body.password
    });
    
    return NextResponse.json({ message: 'Connected successfully' });
  } catch (error) {
    console.error('Failed to connect to network:', error);
    return NextResponse.json(
      { error: 'Failed to connect to network' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body: DeleteRequestBody = await request.json();
    await wifi.deleteConnection({ ssid: body.ssid });
    return NextResponse.json({ message: 'Network forgotten successfully' });
  } catch (error) {
    console.error('Failed to forget network:', error);
    return NextResponse.json(
      { error: 'Failed to forget network' },
      { status: 500 }
    );
  }
}
