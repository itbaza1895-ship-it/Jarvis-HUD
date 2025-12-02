import { 
  FaceDetector, 
  FaceLandmarker,
  FilesetResolver,
  HandLandmarker
} from '@mediapipe/tasks-vision';

// Singleton instance to prevent multiple initializations
let mediaPipeInstance: MediaPipeTrackers | null = null;
let isInitializing = false;

interface MediaPipeTrackers {
  faceDetector: FaceDetector;
  faceLandmarker: FaceLandmarker;
  handDetector: HandLandmarker;
  startTracking: () => void;
  cleanup: () => void;
}

export async function initializeMediaPipe(): Promise<MediaPipeTrackers> {
  // Return existing instance if already initialized
  if (mediaPipeInstance) {
    console.log('♻️ Reusing existing MediaPipe instance');
    return mediaPipeInstance;
  }

  // Wait if initialization is in progress
  if (isInitializing) {
    console.log('⏳ MediaPipe initialization in progress...');
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (mediaPipeInstance) return mediaPipeInstance;
  }

  isInitializing = true;
  console.log('⚙️ Loading MediaPipe models...');

  // Suppress TensorFlow Lite INFO logs (they're just informational, not errors)
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  console.log = (...args) => {
    const msg = args[0]?.toString() || '';
    if (!msg.includes('TensorFlow Lite') && !msg.includes('XNNPACK')) {
      originalConsoleLog(...args);
    }
  };
  console.info = (...args) => {
    const msg = args[0]?.toString() || '';
    if (!msg.includes('TensorFlow Lite') && !msg.includes('XNNPACK')) {
      originalConsoleInfo(...args);
    }
  };

  try {
    // Load MediaPipe vision tasks
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    // Initialize Face Detector (for bounding box)
    const faceDetector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO'
    });

    // Initialize Face Landmarker (for detailed facial features and expressions)
    const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: false
    });

    // Initialize Hand Detector
    const handDetector = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numHands: 1
    });

    // Restore console methods
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    
    console.log('✅ MediaPipe models loaded successfully');

    mediaPipeInstance = {
      faceDetector,
      faceLandmarker,
      handDetector,
      startTracking: () => {
        console.log('🎯 Tracking systems online');
      },
      cleanup: () => {
        console.log('🧹 Cleaning up MediaPipe resources');
        faceDetector.close();
        faceLandmarker.close();
        handDetector.close();
        mediaPipeInstance = null;
      }
    };

    isInitializing = false;
    return mediaPipeInstance;
  } catch (error) {
    // Restore console methods on error
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    
    isInitializing = false;
    console.error('❌ MediaPipe initialization failed:', error);
    throw error;
  }
}
