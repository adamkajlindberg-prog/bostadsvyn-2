import { Code, Database, Download, X, Zap } from "lucide-react";
import React, { useState } from "react";
import PerformanceMonitor from "@/components/performance/PerformanceMonitor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DevToolsProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export default function DevTools({
  isVisible = false,
  onToggle,
}: DevToolsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [logs, setLogs] = useState<
    Array<{ type: string; message: string; timestamp: Date }>
  >([]);

  // Development environment check
  const isDev = process.env.NODE_ENV === "development";

  // Console intercept for logging
  React.useEffect(() => {
    if (!isDev) return;

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    const interceptConsole = (type: string, originalMethod: any) => {
      return (...args: any[]) => {
        originalMethod.apply(console, args);
        setLogs((prev) => [
          ...prev.slice(-49),
          {
            type,
            message: args
              .map((arg) =>
                typeof arg === "object"
                  ? JSON.stringify(arg, null, 2)
                  : String(arg),
              )
              .join(" "),
            timestamp: new Date(),
          },
        ]);
      };
    };

    console.log = interceptConsole("log", originalConsole.log);
    console.error = interceptConsole("error", originalConsole.error);
    console.warn = interceptConsole("warn", originalConsole.warn);
    console.info = interceptConsole("info", originalConsole.info);

    return () => {
      Object.assign(console, originalConsole);
    };
  }, [isDev]);

  const exportLogs = () => {
    const logData = logs
      .map(
        (log) =>
          `[${log.timestamp.toISOString()}] ${log.type.toUpperCase()}: ${log.message}`,
      )
      .join("\n");

    const blob = new Blob([logData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bostadsvyn-logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getSystemInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      screen: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      memory: (performance as any).memory
        ? {
            used: `${((performance as any).memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
            total: `${((performance as any).memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
            limit: `${((performance as any).memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
          }
        : null,
      connection: (navigator as any).connection
        ? {
            effectiveType: (navigator as any).connection.effectiveType,
            downlink: (navigator as any).connection.downlink,
            rtt: (navigator as any).connection.rtt,
          }
        : null,
    };
  };

  if (!isDev) {
    return null;
  }

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-50"
        variant="outline"
        size="sm"
      >
        <Code className="h-4 w-4 mr-2" />
        Dev Tools
      </Button>
    );
  }

  const systemInfo = getSystemInfo();

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-96 max-h-96 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="h-4 w-4" />
            Development Tools
            <Badge variant="secondary" className="text-xs">
              DEV
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mx-4">
            <TabsTrigger value="overview" className="text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">
              Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              System
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">
              Perf
            </TabsTrigger>
          </TabsList>

          <div className="px-4 pb-4">
            <TabsContent value="overview" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded border">
                  <div className="font-semibold">Environment</div>
                  <div className="text-muted-foreground">Development</div>
                </div>
                <div className="p-2 rounded border">
                  <div className="font-semibold">Build</div>
                  <div className="text-muted-foreground">Vite + React</div>
                </div>
                <div className="p-2 rounded border">
                  <div className="font-semibold">Database</div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Connected
                  </div>
                </div>
                <div className="p-2 rounded border">
                  <div className="font-semibold">Auth</div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Active
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-xs">Quick Actions</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Database className="h-3 w-3 mr-1" />
                    DB Reset
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Zap className="h-3 w-3 mr-1" />
                    Clear Cache
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs">
                  Console Logs ({logs.length})
                </h4>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={exportLogs}
                    className="h-6 w-6 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearLogs}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-32 border rounded">
                <div className="p-2 space-y-1">
                  {logs.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No logs yet
                    </div>
                  ) : (
                    logs.slice(-20).map((log, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex items-start gap-2">
                          <Badge
                            variant={
                              log.type === "error"
                                ? "destructive"
                                : log.type === "warn"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs px-1 py-0"
                          >
                            {log.type}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{log.message}</div>
                            <div className="text-muted-foreground text-xs">
                              {log.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="system" className="space-y-3 mt-3">
              <ScrollArea className="h-32">
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="font-semibold">Browser</div>
                    <div className="text-muted-foreground truncate">
                      {
                        systemInfo.userAgent.split(" ")[
                          systemInfo.userAgent.split(" ").length - 1
                        ]
                      }
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold">Viewport</div>
                    <div className="text-muted-foreground">
                      {systemInfo.viewport}
                    </div>
                  </div>

                  {systemInfo.memory && (
                    <div>
                      <div className="font-semibold">Memory</div>
                      <div className="text-muted-foreground">
                        {systemInfo.memory.used} / {systemInfo.memory.total}
                      </div>
                    </div>
                  )}

                  {systemInfo.connection && (
                    <div>
                      <div className="font-semibold">Connection</div>
                      <div className="text-muted-foreground">
                        {systemInfo.connection.effectiveType} -{" "}
                        {systemInfo.connection.downlink} Mbps
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="font-semibold">Status</div>
                    <div className="text-muted-foreground">
                      {systemInfo.onlineStatus ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="performance" className="space-y-3 mt-3">
              <div className="text-xs">
                <div className="text-center text-muted-foreground">
                  Performance monitoring active
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>

      {/* Performance Monitor */}
      <PerformanceMonitor showDetails={false} />
    </Card>
  );
}

// Hook to enable dev tools
export function useDevTools() {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D to toggle dev tools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return {
    isVisible,
    toggle: () => setIsVisible((prev) => !prev),
  };
}
