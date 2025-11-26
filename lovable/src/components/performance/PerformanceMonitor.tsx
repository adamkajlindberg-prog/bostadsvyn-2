import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Activity, 
  Zap, 
  Clock, 
  Database, 
  Wifi, 
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  loadTime: number;
  domContentLoaded: number;
  networkEffectiveType?: string;
  connectionDownlink?: number;
  memoryUsage?: number;
  jsHeapSize?: number;
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function PerformanceMonitor({ 
  showDetails = false, 
  autoRefresh = false,
  refreshInterval = 30000 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(showDetails);

  const collectPerformanceMetrics = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    // Network information
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Memory information
    const memory = (performance as any).memory;

    const newMetrics: PerformanceMetrics = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      networkEffectiveType: connection?.effectiveType,
      connectionDownlink: connection?.downlink,
      memoryUsage: memory?.usedJSHeapSize,
      jsHeapSize: memory?.totalJSHeapSize,
    };

    // Add paint metrics
    paint.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        newMetrics.fcp = entry.startTime;
      }
    });

    // Core Web Vitals (would need additional libraries in production)
    // Using Performance Observer for LCP, FID, CLS
    if ('PerformanceObserver' in window) {
      try {
        // LCP
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          newMetrics.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // FID
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            newMetrics.fid = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });

        // CLS
        new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          newMetrics.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.log('Performance Observer not fully supported');
      }
    }

    setMetrics(newMetrics);
  };

  useEffect(() => {
    // Initial collection
    setTimeout(collectPerformanceMetrics, 1000);

    // Auto refresh
    if (autoRefresh) {
      const interval = setInterval(collectPerformanceMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getScoreColor = (value: number | undefined, thresholds: [number, number]) => {
    if (!value) return 'secondary';
    if (value <= thresholds[0]) return 'default'; // Good (green)
    if (value <= thresholds[1]) return 'secondary'; // Needs improvement (yellow)
    return 'destructive'; // Poor (red)
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Monitor
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={collectPerformanceMetrics}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {metrics && (
          <>
            {/* Core Web Vitals */}
            <div>
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <Badge 
                    variant={getScoreColor(metrics.lcp, [2500, 4000])}
                    className="text-xs"
                  >
                    LCP
                  </Badge>
                  <div className="mt-1">{metrics.lcp ? formatTime(metrics.lcp) : 'N/A'}</div>
                </div>
                <div className="text-center">
                  <Badge 
                    variant={getScoreColor(metrics.fid, [100, 300])}
                    className="text-xs"
                  >
                    FID
                  </Badge>
                  <div className="mt-1">{metrics.fid ? formatTime(metrics.fid) : 'N/A'}</div>
                </div>
                <div className="text-center">
                  <Badge 
                    variant={getScoreColor(metrics.cls ? metrics.cls * 1000 : undefined, [100, 250])}
                    className="text-xs"
                  >
                    CLS
                  </Badge>
                  <div className="mt-1">{metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Loading Performance */}
            <div>
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Loading Times
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Page Load:</span>
                  <span className="font-mono">{formatTime(metrics.loadTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>DOM Ready:</span>
                  <span className="font-mono">{formatTime(metrics.domContentLoaded)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TTFB:</span>
                  <span className="font-mono">{formatTime(metrics.ttfb)}</span>
                </div>
                {metrics.fcp && (
                  <div className="flex justify-between">
                    <span>FCP:</span>
                    <span className="font-mono">{formatTime(metrics.fcp)}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Network & Memory */}
            <div>
              <h4 className="font-semibold text-xs mb-2 flex items-center gap-1">
                <Database className="h-3 w-3" />
                Resources
              </h4>
              <div className="space-y-1 text-xs">
                {metrics.networkEffectiveType && (
                  <div className="flex justify-between items-center">
                    <span>Network:</span>
                    <Badge variant="secondary" className="text-xs">
                      <Wifi className="h-3 w-3 mr-1" />
                      {metrics.networkEffectiveType}
                    </Badge>
                  </div>
                )}
                {metrics.connectionDownlink && (
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span className="font-mono">{metrics.connectionDownlink.toFixed(1)} Mbps</span>
                  </div>
                )}
                {metrics.memoryUsage && (
                  <div className="flex justify-between">
                    <span>Memory:</span>
                    <span className="font-mono">{formatBytes(metrics.memoryUsage)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Score */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-center gap-2">
                {metrics.loadTime < 3000 && metrics.domContentLoaded < 2000 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-xs text-success font-semibold">Excellent Performance</span>
                  </>
                ) : metrics.loadTime < 5000 ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-xs text-warning font-semibold">Good Performance</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-critical" />
                    <span className="text-xs text-critical font-semibold">Needs Improvement</span>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for performance monitoring
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      // Process performance entries
      console.log('Performance entries:', entries);
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

    return () => observer.disconnect();
  }, []);

  return metrics;
}