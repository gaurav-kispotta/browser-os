export interface SystemInfo {
  platform: string;
  type: string;
  release: string;
  hostname: string;
  arch: string;
  cpus: Array<{
    model: string;
    speed: number;
  }>;
  totalMemory: number;
  freeMemory: number;
  uptime: number;
  loadAvg: number[];
  userInfo: {
    username: string;
    uid: number;
    gid: number;
    shell: string;
    homedir: string;
  };
  homedir: string;
  tempdir: string;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  try {
    const response = await fetch('/api/system/info');
    if (!response.ok) {
      throw new Error('Failed to fetch system information');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting system information:', error);
    throw error;
  }
}

export async function shutdownSystem(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/system/shutdown', {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error shutting down system:', error);
    return { success: false, message: 'Failed to send shutdown command' };
  }
}

export async function restartSystem(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/system/restart', {
      method: 'POST',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error restarting system:', error);
    return { success: false, message: 'Failed to send restart command' };
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}
