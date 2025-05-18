import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const networkInterfaces = os.networkInterfaces();
    let ipAddress = 'localhost';

    // Look for non-internal IPv4 addresses
    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
      if (!interfaces) continue;

      for (const interface_ of interfaces) {
        // Skip internal and non-IPv4 addresses
        if (!interface_.internal && interface_.family === 'IPv4') {
          ipAddress = interface_.address;
          break;
        }
      }
      if (ipAddress !== 'localhost') break;
    }

    return NextResponse.json({ 
      ip: ipAddress,
      port: process.env.PORT || 3000
    });
  } catch (error) {
    console.error('Error getting IP address:', error);
    return NextResponse.json({ 
      ip: 'localhost',
      port: 3000
    }, { status: 500 });
  }
}
