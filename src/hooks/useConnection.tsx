"use client"

import { useCloud } from "@/cloud/useCloud";
import React, { createContext, useState } from "react";
import { useCallback } from "react";
import { useConfig } from "./useConfig";
import { useToast } from "@/components/toast/ToasterProvider";

export type ConnectionMode = "cloud" | "manual" | "env"

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl: string;
  token: string;
  mode: ConnectionMode;
  disconnect: () => Promise<void>;
  connect: (mode: ConnectionMode) => Promise<void>;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(undefined);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { generateToken, wsUrl: cloudWSUrl } = useCloud();
  const { setToastMessage } = useToast();
  const { config } = useConfig();
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl: string;
    token: string;
    mode: ConnectionMode;
    shouldConnect: boolean;
  }>({ wsUrl: "", token: "", shouldConnect: false, mode: "manual" });

  const connect = useCallback(
    async (mode: ConnectionMode) => {
      let token = "";
      let url = "";

      // Get the selected role from localStorage
      const selectedRole = localStorage.getItem('interviewRole');
      
      // Validate role before proceeding
      const validRoles = [
        'fullstack', 'devops', 'frontend', 'backend', 'software',
        'data', 'ml', 'cloud', 'sysadmin', 'qa', 'electronics',
        'electrical', 'mechanical', 'civil', 'product', 'project',
        'uiux', 'dba', 'security', 'network'
      ];
      
      if (!selectedRole || !validRoles.includes(selectedRole)) {
        setToastMessage({
          type: "error",
          message: "Please select a valid room before connecting.",
        });
        return;
      }

      try {
        if (mode === "cloud") {
          try {
            token = await generateToken();
          } catch (error) {
            setToastMessage({
              type: "error",
              message: "Failed to generate token, you may need to increase your role in this LiveKit Cloud project.",
            });
            return;
          }
          url = cloudWSUrl;
        } else if (mode === "env") {
          if (!process.env.NEXT_PUBLIC_LIVEKIT_URL) {
            throw new Error("NEXT_PUBLIC_LIVEKIT_URL is not set");
          }
          url = process.env.NEXT_PUBLIC_LIVEKIT_URL;

          const response = await fetch("/api/token", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: selectedRole }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get access token');
          }

          const data = await response.json();
          if (!data.accessToken) {
            throw new Error('No access token in response');
          }
          token = data.accessToken;
        } else {
          token = config.settings.token;
          url = config.settings.ws_url;
        }

        setConnectionDetails({ wsUrl: url, token, shouldConnect: true, mode });
      } catch (error) {
        console.error('Error getting token:', error);
        setToastMessage({
          type: "error",
          message: error instanceof Error ? error.message : "Failed to get access token. Please try again.",
        });
        throw error;
      }
    },
    [
      cloudWSUrl,
      config.settings.token,
      config.settings.ws_url,
      generateToken,
      setToastMessage,
    ]
  );

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        shouldConnect: connectionDetails.shouldConnect,
        mode: connectionDetails.mode,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}