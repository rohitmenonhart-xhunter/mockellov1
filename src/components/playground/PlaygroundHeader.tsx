import { Button } from "@/components/button/Button";
import { LoadingSVG } from "@/components/button/LoadingSVG";
import { SettingsDropdown } from "@/components/playground/SettingsDropdown";
import { useConfig } from "@/hooks/useConfig";
import { ConnectionState } from "livekit-client";
import { ReactNode, useEffect, useState } from "react";

type PlaygroundHeader = {
  logo?: ReactNode;
  title?: ReactNode;
  githubLink?: string;
  height: number;
  accentColor: string;
  connectionState: ConnectionState;
  onConnectClicked: () => void;
  timeLeft?: number;
};

const roles = [
  { id: 'fullstack', label: 'Room 001' },
  { id: 'devops', label: 'Room 002' },
  { id: 'frontend', label: 'Room 003' },
  { id: 'backend', label: 'Room 004' },
  { id: 'software', label: 'Room 005' },
  { id: 'data', label: 'Room 006' },
  { id: 'ml', label: 'Room 007' },
  { id: 'cloud', label: 'Room 008' },
  { id: 'sysadmin', label: 'Room 009' },
  { id: 'qa', label: 'Room 010' },
  { id: 'electronics', label: 'Room 011' },
  { id: 'electrical', label: 'Room 012' },
  { id: 'mechanical', label: 'Room 013' },
  { id: 'civil', label: 'Room 014' },
  { id: 'product', label: 'Room 015' },
  { id: 'project', label: 'Room 016' },
  { id: 'uiux', label: 'Room 017' },
  { id: 'dba', label: 'Room 018' },
  { id: 'security', label: 'Room 019' },
  { id: 'network', label: 'Room 020' }
];

export const PlaygroundHeader = ({
  logo,
  title,
  githubLink,
  accentColor,
  height,
  onConnectClicked,
  connectionState,
  timeLeft = 0,
}: PlaygroundHeader) => {
  const { config } = useConfig();
  const [selectedRole, setSelectedRole] = useState('');
  const [hasAttemptedConnect, setHasAttemptedConnect] = useState(false);

  const renderButton = () => {
    if (connectionState === ConnectionState.Connecting) {
      return <LoadingSVG />;
    }
    if (connectionState === ConnectionState.Connected) {
      return "Note: session closing soon";
    }
    return selectedRole ? "Connect" : "Select Role";
  };

  const isConnecting = connectionState === ConnectionState.Connecting;
  const isConnected = connectionState === ConnectionState.Connected;
  const isDisconnected = connectionState === ConnectionState.Disconnected;

  const shouldShowButton = 
    (isDisconnected && !hasAttemptedConnect) || (isConnected && timeLeft <= 300);

  // Auto-click when button appears for feedback generation only
  useEffect(() => {
    if (shouldShowButton && isConnected && timeLeft <= 300) {
      console.log("Generate Feedback button appeared, auto-clicking in 15 seconds");
      const timer = setTimeout(() => {
        console.log("Auto-clicking Generate Feedback button");
        onConnectClicked();
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [shouldShowButton, isConnected, timeLeft, onConnectClicked]);

  const handleConnect = () => {
    if (selectedRole && !hasAttemptedConnect) {
      localStorage.setItem('interviewRole', selectedRole);
      setHasAttemptedConnect(true);
      onConnectClicked();
    }
  };

  // Reset hasAttemptedConnect when disconnected
  useEffect(() => {
    if (isDisconnected) {
      setHasAttemptedConnect(false);
    }
  }, [isDisconnected]);

  return (
    <div
      className={`flex gap-4 pt-4 text-${accentColor}-500 justify-between items-center shrink-0`}
      style={{
        height: height + "px",
      }}
    >
      <div className="flex items-center gap-3 basis-2/3">
        <div className="lg:basis-1/2 lg:text-center text-xs lg:text-base lg:font-semibold text-white">
          {title}
        </div>
      </div>
      <div className="flex basis-1/3 justify-end items-center gap-4">
        {config.settings.editable && <SettingsDropdown />}
        {shouldShowButton && isDisconnected && (
          <>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-white text-sm bg-gray-900 border border-gray-800 rounded-sm px-3 py-2 focus:border-[#BE185D] focus:outline-none"
              disabled={isConnecting || hasAttemptedConnect}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
            <Button
              accentColor={accentColor}
              disabled={isConnecting || !selectedRole || hasAttemptedConnect}
              onClick={handleConnect}
            >
              {renderButton()}
            </Button>
          </>
        )}
        {shouldShowButton && isConnected && (
          <Button
            accentColor="red"
            onClick={onConnectClicked}
          >
            {renderButton()}
          </Button>
        )}
      </div>
    </div>
  );
};



