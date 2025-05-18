"use client"
import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Badge, Descriptions, message } from 'antd';
import { ReloadOutlined, GlobalOutlined } from '@ant-design/icons';
import { scanLocalNetworks } from '../../services';

interface NetworkInterface {
  name: string;
  ip: string;
  mac: string;
  netmask: string;
  gateway?: string;
  dhcp: boolean;
  active: boolean;
  type: 'Ethernet' | 'Wi-Fi' | 'Other';
  speed?: string;
  dns?: string[];
}

const LANSettings: React.FC = () => {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    setIsLoading(true);
    try {
      const networkInterfaces = await scanLocalNetworks();
      setInterfaces(networkInterfaces);
    } catch (error) {
      message.error('Failed to scan network interfaces');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleScan();
  }, []);

  const getNetworkTypeIcon = (type: NetworkInterface['type']) => {
    return <GlobalOutlined className="text-xl" />;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4} className="!mb-0">Network Interfaces</Typography.Title>
        <Button
          icon={<ReloadOutlined spin={isLoading} />}
          onClick={handleScan}
          loading={isLoading}
        >
          Refresh
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
        dataSource={interfaces}
        loading={isLoading}
        renderItem={(interface_) => (
          <List.Item>
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getNetworkTypeIcon(interface_.type)}
                  <Typography.Title level={5} className="!mb-0 ml-2">
                    {interface_.name}
                  </Typography.Title>
                </div>
                <Badge
                  status={interface_.active ? "success" : "default"}
                  text={interface_.active ? "Connected" : "Disconnected"}
                />
              </div>

              <Descriptions column={1} size="small">
                <Descriptions.Item label="IP Address">{interface_.ip}</Descriptions.Item>
                <Descriptions.Item label="MAC Address">{interface_.mac}</Descriptions.Item>
                <Descriptions.Item label="Subnet Mask">{interface_.netmask}</Descriptions.Item>
                {interface_.gateway && (
                  <Descriptions.Item label="Gateway">{interface_.gateway}</Descriptions.Item>
                )}
                <Descriptions.Item label="DHCP">{interface_.dhcp ? "Enabled" : "Disabled"}</Descriptions.Item>
                {interface_.speed && (
                  <Descriptions.Item label="Speed">{interface_.speed}</Descriptions.Item>
                )}
                {interface_.dns && interface_.dns.length > 0 && (
                  <Descriptions.Item label="DNS Servers">
                    {interface_.dns.join(", ")}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default LANSettings;
