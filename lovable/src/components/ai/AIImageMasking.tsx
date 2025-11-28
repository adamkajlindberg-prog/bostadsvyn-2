import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Circle, Rect, PencilBrush, FabricImage } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Brush, 
  Eraser, 
  Square, 
  Circle as CircleIcon, 
  Undo, 
  Redo, 
  Download,
  Wand2,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface AIImageMaskingProps {
  imageUrl: string;
  onMaskCreated: (maskDataUrl: string) => void;
  onClose: () => void;
}

export default function AIImageMasking({ imageUrl, onMaskCreated, onClose }: AIImageMaskingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [brushSize, setBrushSize] = useState([20]);
  const [activeTool, setActiveTool] = useState<'brush' | 'eraser' | 'rectangle' | 'circle' | 'select'>('brush');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#000000", // Black background for mask
    });

    // Load the base image
    FabricImage.fromURL(imageUrl).then((fabricImg) => {
      canvas.backgroundImage = fabricImg;
      canvas.renderAll();
    });

    // Configure drawing brush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = '#FFFFFF'; // White for mask areas
    canvas.freeDrawingBrush.width = brushSize[0];
    canvas.isDrawingMode = true;

    // Save state for undo/redo
    const saveState = () => {
      const canvasState = canvas.toJSON();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(canvasState));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    canvas.on('path:created', saveState);
    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.freeDrawingBrush.width = brushSize[0];
    
    // Update tool behavior
    switch (activeTool) {
      case 'brush':
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = '#FFFFFF';
        break;
      case 'eraser':
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = '#000000';
        break;
      case 'select':
        fabricCanvas.isDrawingMode = false;
        break;
      case 'rectangle':
      case 'circle':
        fabricCanvas.isDrawingMode = false;
        break;
    }
  }, [activeTool, brushSize, fabricCanvas]);

  const handleShapeClick = (shape: 'rectangle' | 'circle') => {
    if (!fabricCanvas) return;
    
    setActiveTool(shape);

    if (shape === 'rectangle') {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: '#FFFFFF',
        width: 100,
        height: 100,
        stroke: '#FFFFFF',
        strokeWidth: 2
      });
      fabricCanvas.add(rect);
    } else if (shape === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: '#FFFFFF',
        radius: 50,
        stroke: '#FFFFFF',
        strokeWidth: 2
      });
      fabricCanvas.add(circle);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      const prevState = history[historyIndex - 1];
      fabricCanvas.loadFromJSON(JSON.parse(prevState), () => {
        fabricCanvas.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      const nextState = history[historyIndex + 1];
      fabricCanvas.loadFromJSON(JSON.parse(nextState), () => {
        fabricCanvas.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#000000';
    fabricCanvas.renderAll();
    toast({
      title: "Mask rensad",
      description: "Masken har rensats. Börja rita igen.",
    });
  };

  const handleAutoMask = async () => {
    setIsProcessing(true);
    try {
      // Use browser-based AI to detect main subject
      const { pipeline } = await import('@huggingface/transformers');
      const segmenter = await pipeline(
        'image-segmentation',
        'Xenova/segformer-b0-finetuned-ade-512-512',
        { device: 'webgpu' }
      );

      const result = await segmenter(imageUrl);
      
      if (result && result[0] && result[0].mask) {
        // Convert segmentation result to canvas mask
        const maskCanvas = document.createElement('canvas');
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx || !fabricCanvas) throw new Error('Canvas context not available');

        maskCanvas.width = fabricCanvas.width;
        maskCanvas.height = fabricCanvas.height;

        // Create ImageData from segmentation mask
        const imageData = maskCtx.createImageData(maskCanvas.width, maskCanvas.height);
        const maskData = result[0].mask.data;
        
        for (let i = 0; i < maskData.length; i++) {
          const pixelIndex = i * 4;
          const maskValue = Math.round(maskData[i] * 255);
          imageData.data[pixelIndex] = maskValue;     // R
          imageData.data[pixelIndex + 1] = maskValue; // G
          imageData.data[pixelIndex + 2] = maskValue; // B
          imageData.data[pixelIndex + 3] = 255;       // A
        }
        
        maskCtx.putImageData(imageData, 0, 0);
        
        // Add the generated mask to the fabric canvas
        const maskDataUrl = maskCanvas.toDataURL();
        
        // Create image element and add as overlay
        FabricImage.fromURL(maskDataUrl).then((fabricImg) => {
          fabricCanvas.overlayImage = fabricImg;
          fabricCanvas.renderAll();
        });

        toast({
          title: "Auto-mask skapad! 🎯",
          description: "AI har automatiskt identifierat huvudobjektet. Du kan justera masken manuellt.",
        });
      }
    } catch (error) {
      console.error('Auto-mask error:', error);
      toast({
        title: "Auto-mask misslyckades",
        description: "Kunde inte skapa automatisk mask. Använd manuella verktyg.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportMask = () => {
    if (!fabricCanvas) return;

    // Create a clean mask canvas (black background, white mask areas)
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = fabricCanvas.width;
    maskCanvas.height = fabricCanvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    
    if (!maskCtx) return;

    // Fill with black background
    maskCtx.fillStyle = '#000000';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    // Render only the mask objects (not the background image)
    const objects = fabricCanvas.getObjects();
    objects.forEach(obj => {
      if (obj.type === 'path' || obj.type === 'rect' || obj.type === 'circle') {
        // Render object to temporary canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = maskCanvas.width;
        tempCanvas.height = maskCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // This is a simplified approach - in production you'd want more sophisticated rendering
          if (obj.fill === '#FFFFFF' || obj.stroke === '#FFFFFF') {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            maskCtx.globalCompositeOperation = 'source-over';
            maskCtx.drawImage(tempCanvas, 0, 0);
          }
        }
      }
    });

    const maskDataUrl = maskCanvas.toDataURL('image/png');
    onMaskCreated(maskDataUrl);
    
    toast({
      title: "Mask exporterad! ✅",
      description: "Masken är klar att användas för inpainting.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brush className="h-5 w-5" />
          AI-assisterad maskering
        </h3>
        <Badge variant="secondary">
          Rita vita områden för att markera vad som ska redigeras
        </Badge>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant={activeTool === 'brush' ? 'default' : 'outline'}
            onClick={() => setActiveTool('brush')}
          >
            <Brush className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'eraser' ? 'default' : 'outline'}
            onClick={() => setActiveTool('eraser')}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => handleShapeClick('rectangle')}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'circle' ? 'default' : 'outline'}
            onClick={() => handleShapeClick('circle')}
          >
            <CircleIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Storlek:</span>
          <div className="w-24">
            <Slider
              value={brushSize}
              onValueChange={setBrushSize}
              max={50}
              min={1}
              step={1}
            />
          </div>
          <span className="text-sm text-muted-foreground">{brushSize[0]}px</span>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClear}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          size="sm"
          variant="secondary"
          onClick={handleAutoMask}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Auto-mask
        </Button>
      </div>

      {/* Canvas */}
      <div className="border rounded-lg overflow-hidden bg-muted/30">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportMask}>
            <Download className="h-4 w-4 mr-2" />
            Ladda ner mask
          </Button>
          <Button onClick={handleExportMask} className="bg-primary">
            Använd mask
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>• <strong>Rita med vitt</strong> för att markera områden som ska redigeras</p>
        <p>• <strong>Använd radergummi</strong> för att ta bort maskområden</p>
        <p>• <strong>Auto-mask</strong> använder AI för att automatiskt identifiera huvudobjekt</p>
      </div>
    </div>
  );
}