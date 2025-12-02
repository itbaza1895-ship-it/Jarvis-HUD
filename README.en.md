# JARVIS HUD - AR Face & Gesture Tracking System

Interactive augmented reality system inspired by J.A.R.V.I.S. from Iron Man featuring real-time face recognition, emotion analysis, hand gesture tracking, and 3D object manipulation.

![JARVIS HUD Preview](https://via.placeholder.com/1200x630.png?text=JARVIS+HUD+System)

## ✨ Features

- 🎭 **Face Recognition** - Real-time face position tracking using MediaPipe
- 😊 **Emotion Analysis** - Mood detection from facial expressions
- 👋 **Gesture Tracking** - Control 3D objects with hand movements
- 🌍 **Interactive Globe** - 3D visualization with gesture controls (pinch to scale)
- 📹 **Multi-Camera Support** - Webcam and IP/WiFi camera compatibility
- 🎨 **Sci-Fi Interface** - Futuristic JARVIS-style HUD with animations
- ⚡ **High Performance** - GPU-accelerated optimization

## 🚀 Quick Start

### Requirements

- Node.js 18+ or Bun
- Modern browser with WebRTC support (Chrome, Firefox, Edge)
- Webcam or IP camera

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/jarvis-hud.git
cd jarvis-hud
```

2. **Install dependencies**
```bash
# Using npm
npm install

# Or with Bun (faster)
bun install
```

3. **Start dev server**
```bash
# npm
npm run dev

# Bun
bun dev
```

4. **Open in browser**
```
http://localhost:8080
```

5. **Allow camera access** when browser requests permission

## 📦 Production Build

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

Built files will be in the `dist/` folder

## 🎮 Usage

### Camera Controls

1. **Webcam**: Automatically connects on startup
2. **Switch Cameras**: Use camera selector in top-right corner
3. **IP/WiFi Camera**: 
   - Click "Add IP Camera"
   - Enter stream URL (e.g., `http://192.168.1.100:8080/video`)
   - Supported formats: MJPEG, HLS

### Gesture Controls

- **Open Palm** - Rotate globe
- **Pinch (thumb + index finger)** - Scale globe
- **Hand Movement** - Change rotation speed

### Biometric Data

HUD displays real-time:
- Face coordinates
- Tracking confidence
- Emotional state
- Gesture detection status
- System FPS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **3D Graphics**: Three.js
- **Computer Vision**: MediaPipe (Face Detection, Face Landmarks, Hand Tracking)
- **AI/ML**: TensorFlow Lite (via MediaPipe)

## 📁 Project Structure

```
jarvis-hud/
├── src/
│   ├── components/          # React components
│   │   ├── JarvisHUD.tsx   # Main system component
│   │   ├── WebcamFeed.tsx  # Camera management
│   │   ├── CameraSelector.tsx # Camera selector
│   │   ├── HeadsUpDisplay.tsx # HUD interface
│   │   ├── Globe.tsx       # 3D globe (Three.js)
│   │   ├── FaceTrackingOverlay.tsx
│   │   └── HandTrackingOverlay.tsx
│   ├── lib/                # Utilities and libraries
│   │   ├── mediapipe.ts   # MediaPipe initialization
│   │   └── emotionAnalyzer.ts # Emotion analysis
│   ├── types/             # TypeScript types
│   │   └── tracking.ts
│   ├── index.css          # Global styles + design system
│   └── main.tsx           # Entry point
├── public/                # Static files
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in project root (optional):

```env
# Dev server port (default 8080)
VITE_PORT=8080

# Host (default ::)
VITE_HOST=::
```

### MediaPipe Settings

In `src/lib/mediapipe.ts` you can configure:
- Number of tracked faces (`numFaces`)
- Number of tracked hands (`numHands`)
- Delegate (GPU/CPU)
- Model paths

### Camera Settings

In `src/components/WebcamFeed.tsx`:
```typescript
const constraints = {
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: 'user'
  }
};
```

## 🔧 Troubleshooting

### Camera Not Working

1. Check browser permissions for camera access
2. Ensure camera isn't being used by another application
3. Try a different browser (Chrome recommended)
4. HTTPS required for secure connection

### Low FPS

1. Close other GPU-intensive applications
2. Reduce camera resolution in `WebcamFeed.tsx`
3. Switch to CPU delegate in `mediapipe.ts`:
```typescript
delegate: 'CPU'  // instead of 'GPU'
```

### IP Camera Won't Connect

1. Verify camera URL is accessible in browser
2. Ensure camera supports CORS
3. Use MJPEG or HLS formats
4. Check camera is on the same network

### TensorFlow Info Messages

Messages like `"INFO: Created TensorFlow Lite XNNPACK delegate"` are **not errors**, just informational logs. They're automatically filtered in the code.

## 🌐 Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/jarvis-hud/', // repository name
  // ...
});
```

2. Create workflow `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### OnSpace (current hosting)

Project is already optimized for OnSpace:
- Click "Publish" in OnSpace
- Get a `.onspace.app` domain
- Or add your custom domain in settings

## 📄 License

MIT License - free to use for personal and commercial projects.

## 🤝 Contributing

Pull Requests are welcome! 

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- 🐛 Found a bug? [Create an Issue](https://github.com/your-username/jarvis-hud/issues)
- 💡 Have an idea? [Start a Discussion](https://github.com/your-username/jarvis-hud/discussions)
- 📧 Email: your-email@example.com

## 🙏 Acknowledgments

- [MediaPipe](https://google.github.io/mediapipe/) - for powerful computer vision tools
- [Three.js](https://threejs.org/) - for 3D graphics
- [Tailwind CSS](https://tailwindcss.com/) - for styling
- Iron Man & Marvel - for design inspiration

---

⭐ Star this repo if you like the project!
