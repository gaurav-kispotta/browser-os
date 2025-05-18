'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, Input, Select, Switch, Space, message, Spin, Modal } from 'antd';
import { EditOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { getIPConfig, updateIPConfig, IPConfig } from '../../services/ipConfigService';

const { Option } = Select;

const IPConfigurations: React.FC = () => {
  const [ipConfigs, setIpConfigs] = useState<IPConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInterface, setSelectedInterface] = useState<IPConfig | null>(null);

  const fetchIPConfigs = async () => {
    setLoading(true);
    try {
      const configs = await getIPConfig();
      setIpConfigs(configs);
    } catch (error) {
      message.error('Failed to fetch IP configurations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPConfigs();
  }, []);

  const handleEdit = (record: IPConfig) => {
    setSelectedInterface(record);
    form.setFieldsValue({
      ...record,
      dns: record.dns ? record.dns.join(', ') : '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      // Format DNS servers
      if (values.dns && typeof values.dns === 'string') {
        values.dns = values.dns.split(',').map((dns: string) => dns.trim()).filter(Boolean);
      }

      setLoading(true);
      const result = await updateIPConfig({
        ...values,
        interface: selectedInterface?.interface || ''
      });
      
      if (result.success) {
        message.success('IP configuration updated successfully');
        setModalVisible(false);
        await fetchIPConfigs();
      } else {
        message.error(result.message || 'Failed to update IP configuration');
      }
    } catch (error) {
      message.error('Failed to update IP configuration');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Interface',
      dataIndex: 'interface',
      key: 'interface',
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
    },
    {
      title: 'Netmask',
      dataIndex: 'netmask',
      key: 'netmask',
    },
    {
      title: 'Gateway',
      dataIndex: 'gateway',
      key: 'gateway',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'DNS Servers',
      dataIndex: 'dns',
      key: 'dns',
      render: (dns: string[]) => dns && dns.length > 0 ? dns.join(', ') : 'N/A',
    },
    {
      title: 'DHCP',
      dataIndex: 'dhcp',
      key: 'dhcp',
      render: (dhcp: boolean) => dhcp ? 'Yes' : 'No',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: IPConfig) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">IP Configurations</h2>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchIPConfigs}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      <Card>
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            dataSource={ipConfigs} 
            columns={columns} 
            rowKey="interface"
            pagination={false}
          />
        )}
      </Card>

      <Modal
        title="Edit IP Configuration"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
          >
            Save
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item name="interface" label="Interface" hidden>
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="dhcp"
            label="Use DHCP"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.dhcp !== currentValues.dhcp}
          >
            {({ getFieldValue }) => {
              const dhcp = getFieldValue('dhcp');
              return !dhcp ? (
                <>
                  <Form.Item
                    name="ipAddress"
                    label="IP Address"
                    rules={[
                      { required: true, message: 'Please input IP address!' },
                      {
                        pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                        message: 'Please enter a valid IP address!',
                      },
                    ]}
                  >
                    <Input placeholder="e.g. 192.168.1.100" />
                  </Form.Item>

                  <Form.Item
                    name="netmask"
                    label="Subnet Mask"
                    rules={[
                      { required: true, message: 'Please input subnet mask!' },
                      {
                        pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                        message: 'Please enter a valid subnet mask!',
                      },
                    ]}
                  >
                    <Input placeholder="e.g. 255.255.255.0" />
                  </Form.Item>

                  <Form.Item
                    name="gateway"
                    label="Default Gateway"
                    rules={[
                      {
                        pattern: /^(\d{1,3}\.){3}\d{1,3}$/,
                        message: 'Please enter a valid gateway address!',
                      },
                    ]}
                  >
                    <Input placeholder="e.g. 192.168.1.1" />
                  </Form.Item>
                </>
              ) : null;
            }}
          </Form.Item>

          <Form.Item
            name="dns"
            label="DNS Servers"
            tooltip="Separate multiple DNS servers with commas"
          >
            <Input placeholder="e.g. 8.8.8.8, 1.1.1.1" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IPConfigurations;
