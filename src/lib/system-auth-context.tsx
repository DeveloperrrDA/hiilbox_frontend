"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

interface SystemAuthContextType {
  apiKey: string | null;
  systemToken: string | null;
  isLoading: boolean;
  error: Error | null;
  setApiKey: (key: string) => void;
  refreshSystemToken: () => Promise<string | null>;
  clearAuth: () => void;
}

const SystemAuthContext =
  createContext<SystemAuthContextType | undefined>(undefined);

export interface SystemAuthProviderProps {
  children: React.ReactNode;
}

export const SystemAuthProvider: React.FC<SystemAuthProviderProps> = ({
  children,
}) => {
  const [apiKey, setApiKeyProps] = useState<string | null>(null);
  const [systemToken, setSystemToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const setApiKey = useCallback((key: string) => {
    setApiKeyProps(key);
    setError(null);
  }, []);

  const refreshSystemToken = useCallback(
    async (): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/system-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to retrieve system token"
          );
        }

        if (data?.system_token) {
          setSystemToken(data.system_token);
          return data.system_token;
        }

        throw new Error(
          "API response did not contain a valid system token."
        );
      } catch (err: unknown) {
        const parsedError =
          err instanceof Error
            ? err
            : new Error("Failed to retrieve system token");

        setError(parsedError);
        setSystemToken(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearAuth = useCallback(() => {
    setApiKeyProps(null);
    setSystemToken(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <SystemAuthContext.Provider
      value={{
        apiKey,
        systemToken,
        isLoading,
        error,
        setApiKey,
        refreshSystemToken,
        clearAuth,
      }}
    >
      {children}
    </SystemAuthContext.Provider>
  );
};

export const useSystemAuth = () => {
  const context = useContext(SystemAuthContext);

  if (context === undefined) {
    throw new Error(
      "useSystemAuth must be used within a SystemAuthProvider"
    );
  }

  return context;
};