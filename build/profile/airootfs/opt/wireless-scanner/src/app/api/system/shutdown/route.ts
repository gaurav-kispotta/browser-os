import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';

export async function POST() {
  try {
    const platform = os.platform();
    
    if (platform !== 'linux') {
      return NextResponse.json({ 
        success: false, 
        message: 'Shutdown operation is only supported on Linux' 
      });
    }
    
    // Execute the shutdown command
    exec('sudo shutdown -h now', (error) => {
      if (error) {
        console.error('Error executing shutdown command:', error);
        return;
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Shutdown command sent successfully' 
    });
  } catch (error) {
    console.error('Failed to shutdown system:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to execute shutdown command' },
      { status: 500 }
    );
  }
}
