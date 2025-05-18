declare module 'node-wifi' {
  export interface NetworkInterface {
    iface: string;
    vendor?: string;
    mac?: string;
  }

  export interface WiFiNetwork {
    ssid: string;
    bssid: string;
    mac: string;
    channel: number;
    frequency: number;
    signal_level: number;
    quality: number;
    security: string;
    security_flags: string[];
    mode: string;
  }

  export interface ConnectionOptions {
    ssid: string;
    password?: string;
    interface?: string;
  }

  export interface DeleteConnectionOptions {
    ssid: string;
    interface?: string;
  }

  const wifi: {
    init(options: { iface?: string | null }): void;
    scan(): Promise<WiFiNetwork[]>;
    connect(options: ConnectionOptions): Promise<void>;
    disconnect(): Promise<void>;
    deleteConnection(options: DeleteConnectionOptions): Promise<void>;
    getCurrentConnections(): Promise<WiFiNetwork[]>;
  };

  export default wifi;
}
