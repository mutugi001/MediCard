import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraOff, RotateCcw, Check, X, Upload } from 'lucide-react';
import { faceRecognition } from "@/services/FaceRecognitionService";

const FaceScan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get('return') || '/profile';

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<FormData | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [facingMode, toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const switchCamera = useCallback(() => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, [stopCamera]);

  const uploadFromGallery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  }, [stopCamera]);

  const savePhoto = useCallback(async () => {
  if (!capturedImage) return;

  setIsLoading(true);
  try {
    await faceRecognition(capturedImage, navigate); // 👈 pass it here
  } catch (err: any) {
    toast({
      title: "Recognition Error",
      description: err.message || "Something went wrong.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}, [capturedImage, navigate, toast]);

  // Stop camera when component unmounts or navigation changes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [navigate, stopCamera]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Photo Capture</h1>
          <p className="text-gray-600 mt-2">Take or upload a clear photo for facial matching</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Camera Capture</CardTitle>
            <CardDescription>
              Capture a clear, well-lit photo of the patient's face for identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="Captured patient photo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ display: isCameraActive ? 'block' : 'none' }}
                  />
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <CameraOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Camera not active</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {isCameraActive && !capturedImage && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white border-dashed rounded-lg"></div>
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    Position face within the frame
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              {!capturedImage ? (
                <>
                  {!isCameraActive ? (
                    <Button onClick={startCamera} disabled={isLoading} size="lg">
                      <Camera className="h-5 w-5 mr-2" />
                      {isLoading ? "Starting..." : "Start Camera"}
                    </Button>
                  ) : (
                    <>
                      <Button onClick={capturePhoto} size="lg" className="bg-red-600 hover:bg-red-700">
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Photo
                      </Button>
                      <Button onClick={switchCamera} variant="outline" size="lg">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Switch Camera
                      </Button>
                      <Button onClick={stopCamera} variant="outline" size="lg">
                        <CameraOff className="h-5 w-5 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button onClick={savePhoto} disabled={isLoading} size="lg" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-5 w-5 mr-2" />
                    {isLoading ? "Saving..." : "Save Photo"}
                  </Button>
                  <Button onClick={retakePhoto} variant="outline" size="lg">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Retake
                  </Button>
                </>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Or upload from your device:</p>
                <label htmlFor="gallery-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    Choose from Gallery
                  </div>
                </label>
                <input
                  id="gallery-upload"
                  type="file"
                  accept="image/*"
                  onChange={uploadFromGallery}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate(returnPath)}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default FaceScan;
