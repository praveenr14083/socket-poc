import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function App() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const s = io(backendUrl);
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("devices_update", (data) => {
      setDevices(data);
      setLoading(false);
    });

    return () => s.disconnect();
  }, []);

  const handleToggle = (id) => {
    if (socket && socket.connected) {
      socket.emit("toggle_device", { id });
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
        Loading devices...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen items-center justify-start gap-6 bg-gray-100 p-6">
      {/* Connection Status */}
      <Badge variant={connected ? "success" : "destructive"} className="mb-4">
        {connected ? "Connected" : "Disconnected"}
      </Badge>

      <div className="flex flex-wrap gap-6 justify-center">
        {Object.entries(devices).map(([id, dev]) => (
          <Card key={id} className="w-[250px] shadow-lg">
            <CardHeader>
              <CardTitle>{dev.name}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex items-center justify-between">
              <span>{dev.state ? "On" : "Off"}</span>
              <Switch
                checked={dev.state}
                onCheckedChange={() => handleToggle(id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;
