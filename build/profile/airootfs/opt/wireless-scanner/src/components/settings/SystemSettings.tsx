'use client';

import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Badge, Spin, Alert, Progress, Typography, Divider } from 'antd';
import { getSystemInfo, formatBytes, formatUptime, SystemInfo } from '@/services/systemService';

const { Title, Text } = Typography;

const SystemSettings: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await getSystemInfo();
        setSystemInfo(info);
        setLoading(false);
      } catch (err) {
        setError('Failed to load system information');
        setLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  const calculateMemoryUsage = () => {
    if (!systemInfo) return 0;
    const used = systemInfo.totalMemory - systemInfo.freeMemory;
    return Math.round((used / systemInfo.totalMemory) * 100);
  };

  const getMemoryProgressStatus = (percent: number) => {
    if (percent < 60) return 'success';
    if (percent < 80) return 'normal';
    return 'exception';
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <Spin size="large" tip="Loading system information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      {systemInfo && (
        <>
          <Card className="mb-4" title="Operating System Information">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="OS Type">{systemInfo.type}</Descriptions.Item>
              <Descriptions.Item label="Platform">{systemInfo.platform}</Descriptions.Item>
              <Descriptions.Item label="Release">{systemInfo.release}</Descriptions.Item>
              <Descriptions.Item label="Hostname">{systemInfo.hostname}</Descriptions.Item>
              <Descriptions.Item label="Architecture">{systemInfo.arch}</Descriptions.Item>
              <Descriptions.Item label="Home Directory">{systemInfo.homedir}</Descriptions.Item>
              <Descriptions.Item label="Temp Directory">{systemInfo.tempdir}</Descriptions.Item>
              <Descriptions.Item label="System Uptime">{formatUptime(systemInfo.uptime)}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="mb-4" title="Hardware Resources">
            <div className="mb-5">
              <Title level={5}>Memory Usage</Title>
              <Progress 
                percent={calculateMemoryUsage()} 
                status={getMemoryProgressStatus(calculateMemoryUsage()) as any}
              />
              <div className="flex justify-between mt-2">
                <Text type="secondary">Used: {formatBytes(systemInfo.totalMemory - systemInfo.freeMemory)}</Text>
                <Text type="secondary">Free: {formatBytes(systemInfo.freeMemory)}</Text>
                <Text type="secondary">Total: {formatBytes(systemInfo.totalMemory)}</Text>
              </div>
            </div>

            <Divider />

            <div>
              <Title level={5}>CPU Information</Title>
              <div className="mt-2">
                {systemInfo.cpus.map((cpu, index) => (
                  <div key={index} className="mb-2 p-2 bg-gray-50 rounded">
                    <div><strong>CPU {index + 1}:</strong> {cpu.model}</div>
                    <div><strong>Speed:</strong> {cpu.speed} MHz</div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Text type="secondary">Load Average: {systemInfo.loadAvg.map(load => load.toFixed(2)).join(', ')}</Text>
              </div>
            </div>
          </Card>

          <Card title="User Information">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Username">{systemInfo.userInfo.username}</Descriptions.Item>
              <Descriptions.Item label="User ID">{systemInfo.userInfo.uid}</Descriptions.Item>
              <Descriptions.Item label="Group ID">{systemInfo.userInfo.gid}</Descriptions.Item>
              <Descriptions.Item label="Shell">{systemInfo.userInfo.shell}</Descriptions.Item>
              <Descriptions.Item label="Home Directory">{systemInfo.userInfo.homedir}</Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      )}
    </div>
  );
};

export default SystemSettings;
