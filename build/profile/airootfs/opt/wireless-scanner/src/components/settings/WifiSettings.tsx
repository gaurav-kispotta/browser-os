"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Button, Modal, Input, Badge, Typography, Switch, Dropdown, message, Spin } from 'antd';
import type { InputRef } from 'antd';
import type { MenuProps } from 'antd';
import { WifiOutlined, LockOutlined, ReloadOutlined, SettingOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { scanNetworks, connectToWifi, forgetNetwork } from '../../services';

interface WifiNetwork {
  ssid: string;
  signal: number;
  signalDbm: number;
  secure: boolean;
  connected?: boolean;
  frequency: '2.4GHz' | '5GHz';
  autoConnect?: boolean;
  metered?: boolean;
  savedNetwork?: boolean;
}

interface ConnectionError {
  type: 'auth' | 'timeout' | 'other';
  message: string;
}

const WifiSettings: React.FC = () => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingTo, setConnectingTo] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [connectionError, setConnectionError] = useState<ConnectionError | null>(null);
  const [isNetworkSettingsVisible, setIsNetworkSettingsVisible] = useState(false);
  const passwordInputRef = useRef<InputRef>(null);

  useEffect(() => {
    // Scan for networks when component mounts
    handleScan();
  }, []);

  useEffect(() => {
    // Focus password input when modal opens
    if (isPasswordModalVisible) {
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [isPasswordModalVisible]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const networkList = await scanNetworks();
      setNetworks(networkList);
    } catch (error) {
      message.error('Failed to scan for networks');
    } finally {
      setIsScanning(false);
    }
  };

  const handleNetworkClick = (network: WifiNetwork) => {
    if (isConnecting) return; // Prevent clicks while connecting
    setConnectionError(null);
    if (network.connected) {
      setSelectedNetwork(network);
      setIsNetworkSettingsVisible(true);
    } else if (network.secure && !network.connected) {
      setSelectedNetwork(network);
      setIsPasswordModalVisible(true);
    } else {
      connectToNetwork(network);
    }
  };

  const connectToNetwork = async (network: WifiNetwork, pwd?: string) => {
    setIsConnecting(true);
    setConnectingTo(network.ssid);
    try {
      await connectToWifi(network.ssid, pwd);
      
      // Refresh network list after successful connection
      await handleScan();
      message.success(`Connected to ${network.ssid}`);
    } catch (error) {
      setConnectionError({
        type: 'other',
        message: 'Failed to connect to network. Please try again.'
      });
      message.error('Failed to connect to network');
    } finally {
      setIsConnecting(false);
      setConnectingTo(null);
    }
  };

  const handleForgetNetwork = async (network: WifiNetwork) => {
    try {
      await forgetNetwork(network.ssid);
      message.success(`Forgot network ${network.ssid}`);
      // Refresh network list
      await handleScan();
    } catch (error) {
      message.error('Failed to forget network');
    }
    setIsNetworkSettingsVisible(false);
  };

  const handleConnect = () => {
    if (selectedNetwork) {
      connectToNetwork(selectedNetwork, password);
    }
    setIsPasswordModalVisible(false);
    setPassword('');
    setSelectedNetwork(null);
  };

  const handleNetworkPreferenceChange = (
    network: WifiNetwork,
    setting: 'autoConnect' | 'metered',
    value: boolean
  ) => {
    setNetworks(prev =>
      prev.map(n => {
        if (n.ssid === network.ssid) {
          return {
            ...n,
            [setting]: value
          };
        }
        return n;
      })
    );
  };

  const getSignalStrengthIcon = (signal: number) => {
    if (signal >= 80) return '●●●●';
    if (signal >= 60) return '●●●○';
    if (signal >= 40) return '●●○○';
    return '●○○○';
  };

  const getNetworkMenuItems = (network: WifiNetwork): MenuProps['items'] => [
    {
      key: 'forget',
      label: 'Forget Network',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleForgetNetwork(network)
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Wifi Settings</h2>
        <Button
          type="primary"
          icon={<ReloadOutlined spin={isScanning} />}
          onClick={handleScan}
          loading={isScanning}
          disabled={isConnecting}
        >
          Scan
        </Button>
      </div>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={networks}
          loading={isScanning}
          renderItem={(network) => (
            <List.Item
              className={`transition-colors ${isConnecting ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}`}
              onClick={() => handleNetworkClick(network)}
              actions={[
                connectingTo === network.ssid ? (
                  <LoadingOutlined className="text-lg text-blue-500" spin />
                ) : network.connected && (
                  <Dropdown menu={{ items: getNetworkMenuItems(network) }}>
                    <SettingOutlined className="text-lg" />
                  </Dropdown>
                )
              ]}
            >
              <List.Item.Meta
                avatar={<WifiOutlined className="text-xl" />}
                title={
                  <div className="flex items-center gap-2">
                    <span>{network.ssid}</span>
                    {network.connected && (
                      <Badge status="success" text="Connected" />
                    )}
                    {connectingTo === network.ssid && (
                      <Badge status="processing" text="Connecting..." />
                    )}
                  </div>
                }
                description={
                  <div className="flex items-center gap-2">
                    <Typography.Text type="secondary">
                      {getSignalStrengthIcon(network.signal)} ({network.signalDbm} dBm)
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {network.frequency}
                    </Typography.Text>
                    {network.secure && <LockOutlined />}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={`Connect to ${selectedNetwork?.ssid}`}
        open={isPasswordModalVisible}
        onOk={handleConnect}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          setPassword('');
          setSelectedNetwork(null);
          setConnectionError(null);
        }}
        okText="Connect"
      >
        <Input.Password
          ref={passwordInputRef}
          placeholder="Enter network password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-4"
          status={connectionError ? 'error' : ''}
          onPressEnter={handleConnect}
        />
        {connectionError && (
          <Typography.Text type="danger" className="block mt-2">
            {connectionError.message}
          </Typography.Text>
        )}
      </Modal>

      <Modal
        title={`${selectedNetwork?.ssid} - Network Settings`}
        open={isNetworkSettingsVisible}
        onCancel={() => setIsNetworkSettingsVisible(false)}
        footer={null}
      >
        {selectedNetwork && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Auto-connect</span>
              <Switch
                checked={selectedNetwork.autoConnect}
                onChange={(checked) => 
                  handleNetworkPreferenceChange(selectedNetwork, 'autoConnect', checked)
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Metered connection</span>
              <Switch
                checked={selectedNetwork.metered}
                onChange={(checked) => 
                  handleNetworkPreferenceChange(selectedNetwork, 'metered', checked)
                }
              />
            </div>
            <div className="pt-4 border-t">
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleForgetNetwork(selectedNetwork)}
              >
                Forget Network
              </Button>
            </div>
            <div className="mt-4">
              <Typography.Title level={5}>Network Details</Typography.Title>
              <div className="space-y-2">
                <div>Signal Strength: {selectedNetwork.signalDbm} dBm</div>
                <div>Frequency Band: {selectedNetwork.frequency}</div>
                <div>Security: {selectedNetwork.secure ? 'Secured' : 'Open'}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WifiSettings;
