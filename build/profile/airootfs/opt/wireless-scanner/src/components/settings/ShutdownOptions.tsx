'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message, Modal, Alert, Typography } from 'antd';
import { PoweroffOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { shutdownSystem, restartSystem } from '@/services/systemService';

const { Text, Paragraph } = Typography;
const { confirm } = Modal;

const ShutdownOptions: React.FC = () => {
  const [loading, setLoading] = useState<{ shutdown: boolean; restart: boolean }>({
    shutdown: false,
    restart: false
  });
  const [platform, setPlatform] = useState<string | null>(null);
  const [isLinux, setIsLinux] = useState<boolean>(false);

  useEffect(() => {
    // Get platform information
    const getPlatform = async () => {
      try {
        const response = await fetch('/api/system/info');
        const data = await response.json();
        setPlatform(data.platform);
        setIsLinux(data.platform === 'linux');
      } catch (error) {
        console.error('Error getting platform information:', error);
        message.error('Failed to get system information');
      }
    };

    getPlatform();
  }, []);

  const handleShutdown = () => {
    confirm({
      title: 'Are you sure you want to shut down the system?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will power off the device. Any unsaved work may be lost.',
      okText: 'Shut Down',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        if (!isLinux) {
          message.warning('Shutdown is only supported on Linux systems');
          return;
        }

        setLoading(prev => ({ ...prev, shutdown: true }));
        try {
          const result = await shutdownSystem();
          if (result.success) {
            message.success('Shutdown command sent successfully');
          } else {
            message.error(result.message);
          }
        } catch (error) {
          console.error('Error shutting down system:', error);
          message.error('Failed to shut down the system');
        } finally {
          setLoading(prev => ({ ...prev, shutdown: false }));
        }
      }
    });
  };

  const handleRestart = () => {
    confirm({
      title: 'Are you sure you want to restart the system?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will reboot the device. Any unsaved work may be lost.',
      okText: 'Restart',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        if (!isLinux) {
          message.warning('Restart is only supported on Linux systems');
          return;
        }

        setLoading(prev => ({ ...prev, restart: true }));
        try {
          const result = await restartSystem();
          if (result.success) {
            message.success('Restart command sent successfully');
          } else {
            message.error(result.message);
          }
        } catch (error) {
          console.error('Error restarting system:', error);
          message.error('Failed to restart the system');
        } finally {
          setLoading(prev => ({ ...prev, restart: false }));
        }
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Shutdown Options</h2>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!isLinux && platform && (
            <Alert
              type="warning"
              showIcon
              message="Limited Functionality"
              description={`Power management options are only supported on Linux systems. Current platform: ${platform}`}
            />
          )}

          <div>
            <Paragraph>
              <Text strong>System Power Management</Text>
            </Paragraph>
            <Paragraph>
              These options allow you to shut down or restart your device. Make sure all your work is saved before proceeding.
            </Paragraph>
          </div>

          <Space>
            <Button
              type="primary"
              danger
              icon={<PoweroffOutlined />}
              loading={loading.shutdown}
              onClick={handleShutdown}
              disabled={!isLinux}
            >
              Shut Down
            </Button>

            <Button
              type="default"
              icon={<ReloadOutlined />}
              loading={loading.restart}
              onClick={handleRestart}
              disabled={!isLinux}
            >
              Restart
            </Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default ShutdownOptions;
