# 🧭 ENSET Indoor Navigation Guide

A progressive web application (PWA) designed primarily for ENSET competitive exams navigation and campus orientation for events and ceremonies at École Normale Supérieure de l'Enseignement Technique.

## 🎯 Primary Feature: ENSET Competitive Exams System

### 📚 ConcoursEnset - Complete Exam Management
The core functionality centers around the **ConcoursEnset** page, providing comprehensive exam day support:

#### � Student Information Lookup
- **CNE-based Search**: Students enter their National Student Number (CNE) to access personalized exam details
- **Multi-field Support**: Search by CNE
- **Real-time Validation**: Instant feedback on search queries with error handling

#### 📋 Detailed Exam Information Display
- **Exam Room Assignment**: Clear display of assigned examination room
- **Timing Information**: Exam start time and duration
- **Entry Point Navigation**: Specific entrance door (Porte 1, Porte 2, etc.) for optimal routing
- **Subject Details**: Exam type and subject information
- **Student Verification**: Full name and exam number confirmation

#### 🗺️ Integrated Navigation System
- **Direct Room Navigation**: One-click navigation from exam details to assigned room
- **Multiple Path Support**: Different routes based on student's entry point
- **Visual Step-by-step Guidance**: Progressive image sequences showing the exact path
- **Time Estimation**: Expected walking time to destination

#### 🎨 Enhanced User Experience
- **Animated Interface**: Smooth transitions and loading animations
- **Dark/Light Theme**: Adaptive theme based on user preference
- **Responsive Design**: Optimized for mobile devices (primary exam day usage)
- **Error Handling**: Clear feedback for invalid CNE or connection issues
- **Instructions Dialog**: Built-in help system for first-time users

## 🌟 Additional Features

### 📱 Campus Navigation
- **QR Code Scanner**: Quick access to destinations via QR codes
- **Facility Finder**: Locate toilets, prayer rooms, and other amenities
- **Event Pages**: Support for ENSAD and ENSET ceremonies

### 📱 PWA Capabilities
- **Offline Support**: Works without internet connection once installed
- **Mobile Installation**: Can be installed as a native app
- **Fast Loading**: Optimized performance for exam day usage

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** with TypeScript for type-safe development
- **React Router DOM** for client-side routing
- **Framer Motion** for smooth animations and transitions

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography
- **Custom CSS** for gradient backgrounds and glass effects

### PWA & Performance
- **Vite** as build tool and development server
- **Vite PWA Plugin** for progressive web app features
- **Vercel Analytics** for performance monitoring

### Camera & QR
- **QR Scanner** library for QR code detection
- **Browser Camera API** integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ENSETM-EDU/enset-indoor-navigation-guide
   cd enset-indoor-navigation-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 📋 Usage

### Primary Use Case: Exam Day Navigation
1. **Access ConcoursEnset**: Navigate to `/concours-enset` or scan the exam QR code
2. **Enter Student Information**: Input your CNE (National Student Number)
3. **View Exam Details**: See your room assignment, timing, and entry point
4. **Navigate to Room**: Follow the step-by-step visual navigation to your exam location
5. **Real-time Updates**: Get the most current room assignments and timing information

### Additional Campus Navigation
- **QR Code Scanning**: Use camera to scan campus QR codes for instant directions
- **Facility Location**: Find toilets, prayer rooms, and other campus amenities
- **Event Navigation**: Access ceremony locations

## 🔧 Configuration

### Exam Data Management
Student and exam data is managed through JSON files:
- **cnc-enset-student-ge.json**: Génie Électrique candidates
- **cnc-enset-student-gm.json**: Génie Mécanique candidates  
- **cnc-enset-student-mi.json**: Mathématiques et Informatique candidates

### Navigation Paths
Navigation routes are defined in `public/paths.json` for campus navigation:
```json
{
  "id": "Porte1ToAmphitheatre",
  "from": "Porte 1", 
  "to": "Amphithéâtre",
  "time": "2 min",
  "steps": 15,
  "path": "/photos-navigation/Porte1ToAmphitheatre"
}
```

### PWA Settings
PWA configuration in `vite.config.ts`:
- **App Name**: ENSET Navigation
- **Theme Color**: #002b5b (ENSET Blue)
- **Display Mode**: Standalone
- **Orientation**: Portrait

## 📱 Browser Support

- **Chrome/Chromium**: Full support
- **Safari**: Full support (iOS 14.3+)
- **Firefox**: Full support
- **Edge**: Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Mohammed Haji

## 👥 Team

Developed by Mohammed Haji for ENSET community.

---

**🎓 Built with ❤️ for ENSET Community**
