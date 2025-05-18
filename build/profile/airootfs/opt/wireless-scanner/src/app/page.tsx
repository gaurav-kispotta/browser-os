'use client';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button, Layout, Tabs, Typography } from "antd";
import { QRCode } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import type { TabsProps } from 'antd';

import { WifiSettings } from '../components/settings';
import { SystemSettings } from '../components/settings';
import { BrowserSettings } from '../components/settings';
import { ShutdownOptions } from '../components/settings';
import { IPConfigurations } from '../components/settings';
import { LANSettings } from '../components/settings';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  height: '100vh',
  maxHeight: '100vh',
};

export default function Home() {
  const [qrValue, setQrValue] = React.useState('http://localhost:3000');
  
  React.useEffect(() => {
    const getServerIP = async () => {
      try {
        const response = await fetch('/api/system/ip');
        const data = await response.json();
        setQrValue(`http://${data.ip}:${data.port}/mobile`);
      } catch (error) {
        console.error('Error fetching server IP:', error);
        setQrValue(window.location.href);
      }
    };

    getServerIP();
  }, []);

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Wifi Settings',
      children: <WifiSettings />
    },
    {
      key: '2',
      label: 'LAN Settings',
      children: <LANSettings />
    },
    {
      key: '3',
      label: 'System Settings',
      children: <SystemSettings />
    },
    {
      key: '4',
      label: 'Browser Settings',
      children: <BrowserSettings />
    },
    {
      key: '5',
      label: 'Shutdown',
      children: <ShutdownOptions />
    },
    {
      key: '6',
      label: 'IP Configurations',
      children: <IPConfigurations />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center p-4 border-b">
            <div className="text-center flex flex-col items-center">
              <Typography.Title level={5} className="mb-4">
                Scan to access settings on mobile
              </Typography.Title>
              {typeof window !== 'undefined' && (
                <a href='/mobile'>
                  <QRCode 
                  value={qrValue}
                  style={{ marginBottom: 16 }}
                  bgColor="#ffffff"
                  size={160}
                  color="#000000"
                />
                </a>
              )}
            </div>
          </div>
          <Tabs
            tabPosition="left"
            items={tabItems}
            className="min-h-[600px]"
            style={{ padding: '20px' }}
          />
        </div>
      </div>
    </div>
  );
}
