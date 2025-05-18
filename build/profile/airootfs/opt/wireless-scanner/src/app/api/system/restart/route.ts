import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';

export async function POST() {
  try {
    const platform = os.platform();
    
    if (platform !== 'linux') {
      return NextResponse.json({ 
        success: false, 
        message: 'Restart operation is only supported on Linux' 
      });
    }
    
    // Execute the restart command
    exec('sudo reboot', (error) => {
      if (error) {
        console.error('Error executing restart command:', error);
        return;
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Restart command sent successfully' 
    });
  } catch (error) {
    console.error('Failed to restart system:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute restart command' },
      { status: 500 }
    );
  }
}
