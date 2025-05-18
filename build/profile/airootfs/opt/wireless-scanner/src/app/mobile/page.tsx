"use client";

import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import IPConfigurations from '../../components/settings/IPConfigurations';
import ShutdownOptions from '../../components/settings/ShutdownOptions';
import LANSettings from '../../components/settings/LANSettings';
import SystemSettings from '../../components/settings/SystemSettings';
import BrowserSettings from '../../components/settings/BrowserSettings';
import WifiSettings from '../../components/settings/WifiSettings';

const { Panel } = Collapse;

const MobileSettings: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string | string[]>('1');

    const handleCollapseChange = (key: string | string[]) => {
        setActiveKey(key);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-center">Settings</h2>
                    <Collapse accordion activeKey={activeKey} onChange={handleCollapseChange}>
                        <Panel header="WiFi Settings" key="1">
                            <WifiSettings />
                        </Panel>
                        <Panel header="LAN Settings" key="2">
                            <LANSettings />
                        </Panel>
                        <Panel header="IP Configurations" key="3">
                            <IPConfigurations />
                        </Panel>
                        <Panel header="Shutdown Options" key="4">
                            <ShutdownOptions />
                        </Panel>
                        <Panel header="System Settings" key="5">
                            <SystemSettings />
                        </Panel>
                        <Panel header="Browser Settings" key="6">
                            <BrowserSettings />
                        </Panel>
                    </Collapse>
                </div>
            </div>
        </div>
    );
};

export default MobileSettings;
