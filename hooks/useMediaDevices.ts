"use client"

import { useState, useEffect } from 'react';

interface UseMediaDevicesProps {
  kind?: MediaDeviceKind;
}

export function useMediaDevices({ kind = 'videoinput' }: UseMediaDevicesProps = {}) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        // First request permission by accessing the camera
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Then enumerate devices
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const filteredDevices = allDevices.filter(device => device.kind === kind);
        
        setDevices(filteredDevices);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to access media devices'));
        setLoading(false);
      }
    };

    getDevices();
  }, [kind]);

  // Function to refresh device list
  const refreshDevices = async () => {
    setLoading(true);
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filteredDevices = allDevices.filter(device => device.kind === kind);
      setDevices(filteredDevices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh media devices'));
    } finally {
      setLoading(false);
    }
  };

  return { devices, loading, error, refreshDevices };
}