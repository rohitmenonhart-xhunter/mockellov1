import { useConfig } from "@/hooks/useConfig";
import { CLOUD_ENABLED, CloudConnect } from "../cloud/CloudConnect";
import { Button } from "./button/Button";
import { useState } from "react";
import { ConnectionMode } from "@/hooks/useConnection";

type PlaygroundConnectProps = {
  accentColor: string;
  onConnectClicked: (mode: ConnectionMode) => void;
};

const roles = [
  { id: 'fullstack', label: 'Full Stack Developer' },
  { id: 'devops', label: 'DevOps Engineer' }
];

const RoleSelector = ({ selectedRole, setSelectedRole }: { selectedRole: string, setSelectedRole: (role: string) => void }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-400 text-left">Select Your Role:</label>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      className="text-white text-sm bg-gray-900 border border-gray-800 rounded-sm px-3 py-2 focus:border-[#BE185D] focus:outline-none"
    >
      <option value="">Select a role...</option>
      {roles.map(role => (
        <option key={role.id} value={role.id}>{role.label}</option>
      ))}
    </select>
  </div>
);

export const PlaygroundConnect = ({
  accentColor,
  onConnectClicked,
}: PlaygroundConnectProps) => {
  const [selectedRole, setSelectedRole] = useState('');
  const copy = "Select your role and connect to begin your interview";

  const handleConnect = () => {
    if (!selectedRole) {
      return;
    }
    // Store the role in localStorage before connecting
    localStorage.setItem('interviewRole', selectedRole);
    // Always use env mode to ensure proper token generation
    onConnectClicked("env");
  };

  return (
    <div className="flex left-0 top-0 w-full h-full bg-black/80 items-center justify-center text-center gap-2">
      <div className="min-h-[540px]">
        <div className="flex flex-col bg-gray-950 w-full max-w-[480px] rounded-lg text-white border border-gray-900">
          <div className="flex flex-col gap-2">
            <div className="px-10 space-y-2 py-6">
              <h1 className="text-2xl">Connect to Interview</h1>
              <p className="text-sm text-gray-500">{copy}</p>
            </div>
          </div>
          <div className="flex flex-col bg-gray-900/30 flex-grow p-8">
            <div className="flex flex-col gap-6">
              <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
              
              <Button
                accentColor={accentColor}
                className="w-full"
                disabled={!selectedRole}
                onClick={handleConnect}
              >
                {selectedRole ? 'Start Interview' : 'Please select a role'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
