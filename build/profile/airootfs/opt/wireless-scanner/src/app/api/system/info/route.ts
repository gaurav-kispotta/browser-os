import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const systemInfo = {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      hostname: os.hostname(),
      arch: os.arch(),
      cpus: os.cpus().map(cpu => ({
        model: cpu.model,
        speed: cpu.speed
      })),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      uptime: os.uptime(),
      loadAvg: os.loadavg(),
      userInfo: os.userInfo({encoding: 'utf8'}),
      homedir: os.homedir(),
      tempdir: os.tmpdir()
    };

    return NextResponse.json(systemInfo);
  } catch (error) {
    console.error('Failed to get system information:', error);
    return NextResponse.json(
      { error: 'Failed to get system information' },
      { status: 500 }
    );
  }
}
