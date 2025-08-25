// Camera utility functions for better error handling and permissions management

export interface CameraPermissionStatus {
  hasPermission: boolean;
  error?: string;
  isSupported: boolean;
}

export const checkCameraSupport = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

export const checkCameraPermission = async (): Promise<CameraPermissionStatus> => {
  try {
    // Check if getUserMedia is supported
    if (!checkCameraSupport()) {
      return {
        hasPermission: false,
        error: 'Votre navigateur ne supporte pas l\'accès à la caméra.',
        isSupported: false
      };
    }

    // Try to get permission without actually starting the camera
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 1, height: 1 } 
    });
    
    // Immediately stop the stream
    stream.getTracks().forEach(track => track.stop());
    
    return {
      hasPermission: true,
      isSupported: true
    };
  } catch (error) {
    let errorMessage = 'Erreur inconnue lors de l\'accès à la caméra.';
    
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';
          break;
        case 'NotFoundError':
          errorMessage = 'Aucune caméra trouvée sur cet appareil.';
          break;
        case 'NotSupportedError':
          errorMessage = 'Votre navigateur ne supporte pas l\'accès à la caméra.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'La caméra ne peut pas satisfaire les contraintes demandées.';
          break;
        case 'SecurityError':
          errorMessage = 'Erreur de sécurité. Assurez-vous que votre site utilise HTTPS.';
          break;
        default:
          errorMessage = `Erreur de caméra: ${error.message}`;
      }
    }
    
    return {
      hasPermission: false,
      error: errorMessage,
      isSupported: true
    };
  }
};

export const getCameraDevices = async (): Promise<MediaDeviceInfo[]> => {
  try {
    if (!checkCameraSupport()) {
      return [];
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error getting camera devices:', error);
    return [];
  }
};

export const createCameraConstraints = (
  preferredFacingMode: 'user' | 'environment' = 'environment',
  dimensions?: { width?: number; height?: number }
): MediaStreamConstraints => {
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: preferredFacingMode,
      width: { 
        ideal: dimensions?.width || 1280, 
        min: 640 
      },
      height: { 
        ideal: dimensions?.height || 720, 
        min: 480 
      }
    }
  };
  
  return constraints;
};
