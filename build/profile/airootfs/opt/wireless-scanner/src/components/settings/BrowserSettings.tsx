'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Divider, Typography, Badge } from 'antd';

const { Title, Text } = Typography;

interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  platform: string;
  language: string;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
  online: boolean;
  connectionType?: string;
  maxTouchPoints: number;
  memoryInfo?: {
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
  };
  plugins: string[];
  screenInfo: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: string;
  };
}

const BrowserSettings: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    // Get browser information
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      let name = 'Unknown';
      let version = 'Unknown';

      // Detect browser name and version
      if (userAgent.indexOf('Firefox') > -1) {
        name = 'Firefox';
        version = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Edge') > -1 || userAgent.indexOf('Edg/') > -1) {
        name = 'Microsoft Edge';
        version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || 
                 userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Chrome') > -1) {
        name = 'Chrome';
        version = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Safari') > -1) {
        name = 'Safari';
        version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
        name = 'Internet Explorer';
        version = userAgent.match(/MSIE ([0-9.]+)/)?.[1] || 'Unknown';
      } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR/') > -1) {
        name = 'Opera';
        version = userAgent.match(/Opera\/([0-9.]+)/)?.[1] || 
                  userAgent.match(/OPR\/([0-9.]+)/)?.[1] || 'Unknown';
      }

      // Get plugins
      const plugins = [];
      if (navigator.plugins) {
        for (let i = 0; i < navigator.plugins.length; i++) {
          plugins.push(navigator.plugins[i].name);
        }
      }

      // Get connection type if available
      let connectionType;
      // @ts-ignore - Connection API might not be supported in all browsers
      if (navigator.connection) {
        // @ts-ignore
        connectionType = navigator.connection.effectiveType;
      }

      // Get memory info if available
      let memoryInfo;
      // @ts-ignore - Memory API might not be supported in all browsers
      if (navigator.deviceMemory || performance.memory) {
        memoryInfo = {
          // @ts-ignore
          jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit,
          // @ts-ignore
          totalJSHeapSize: performance.memory?.totalJSHeapSize,
          // @ts-ignore
          usedJSHeapSize: performance.memory?.usedJSHeapSize
        };
      }

      const info: BrowserInfo = {
        name,
        version,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        online: navigator.onLine,
        connectionType,
        maxTouchPoints: navigator.maxTouchPoints,
        memoryInfo,
        plugins,
        screenInfo: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          orientation: window.screen.orientation?.type || 'unknown'
        }
      };

      setBrowserInfo(info);
    };

    detectBrowser();
  }, []);

  // Format bytes to readable format
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return 'Unknown';
    
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  if (!browserInfo) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Browser Settings</h2>
        <Card>
          <div>Loading browser information...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Browser Settings</h2>
      
      <Card className="mb-4" title="Browser Information">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Browser Name">
            {browserInfo.name} {browserInfo.version}
          </Descriptions.Item>
          <Descriptions.Item label="Platform">{browserInfo.platform}</Descriptions.Item>
          <Descriptions.Item label="Language">{browserInfo.language}</Descriptions.Item>
          <Descriptions.Item label="Cookies Enabled">
            {browserInfo.cookiesEnabled ? 
              <Badge status="success" text="Enabled" /> : 
              <Badge status="error" text="Disabled" />
            }
          </Descriptions.Item>
          <Descriptions.Item label="Do Not Track">
            {browserInfo.doNotTrack ? 
              <Badge status="success" text="Enabled" /> : 
              <Badge status="default" text="Disabled or Not Set" />
            }
          </Descriptions.Item>
          <Descriptions.Item label="Online Status">
            {browserInfo.online ? 
              <Badge status="success" text="Online" /> : 
              <Badge status="error" text="Offline" />
            }
          </Descriptions.Item>
          {browserInfo.connectionType && (
            <Descriptions.Item label="Connection Type">
              {browserInfo.connectionType}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Touch Points">{browserInfo.maxTouchPoints}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="mb-4" title="Display Information">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Screen Resolution">
            {browserInfo.screenInfo.width} × {browserInfo.screenInfo.height}
          </Descriptions.Item>
          <Descriptions.Item label="Color Depth">{browserInfo.screenInfo.colorDepth} bits</Descriptions.Item>
          <Descriptions.Item label="Pixel Depth">{browserInfo.screenInfo.pixelDepth} bits</Descriptions.Item>
          <Descriptions.Item label="Orientation">{browserInfo.screenInfo.orientation}</Descriptions.Item>
        </Descriptions>
      </Card>

      {browserInfo.memoryInfo && (
        <Card className="mb-4" title="Browser Memory">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="JS Heap Size Limit">
              {formatBytes(browserInfo.memoryInfo.jsHeapSizeLimit)}
            </Descriptions.Item>
            <Descriptions.Item label="Total JS Heap Size">
              {formatBytes(browserInfo.memoryInfo.totalJSHeapSize)}
            </Descriptions.Item>
            <Descriptions.Item label="Used JS Heap Size">
              {formatBytes(browserInfo.memoryInfo.usedJSHeapSize)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {browserInfo.plugins.length > 0 && (
        <Card title="Browser Plugins">
          <div className="flex flex-wrap gap-2">
            {browserInfo.plugins.map((plugin, index) => (
              <Tag key={index} color="blue">{plugin}</Tag>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BrowserSettings;
