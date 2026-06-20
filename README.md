# 🧬 RadixLab

> **RadixLab** is a premium, high-fidelity, interactive developer suite designed for multi-radix conversions, computer architecture analysis, logic encoding, data structure visualizations, and cryptographic operations. 

Built with **React**, **TypeScript**, **Tailwind CSS v4**, and custom physics-guided spring transitions via **Framer Motion**, RadixLab delivers an ultra-smooth, eye-safe, responsive desktop-first development sandbox.

---

## 🚀 Core Developer Modules

RadixLab gathers comprehensive computer arithmetic and data utilities inside a single visual canvas:

### 🔢 Computations & Converters
*   **Multi-Base Converter:** Effortlessly convert numbers across Binary, Octal, Decimal, Hexadecimal, and arbitrary bases with real-time alignment and clipboard capabilities.
*   **Scientific Calculator:** Comprehensive mathematical operations paired with radix-specific conversion modes.
*   **Batch Converter:** Process multi-record inputs simultaneously with drag-and-drop or batch file importing.
*   **Color Space Converter:** Dynamic hex-to-color decoder with detailed RGB, HSL, and CMYK transformations.

### 🔌 Computer Architecture & Encodings
*   **IEEE 754 Analyzer:** Decode single (32-bit) and double (64-bit) precision floating-point binaries with full structural breakdowns (Sign, Exponent, Mantissa) and rounding error diagnostics.
*   **Signed Complement Lab:** Visualize and convert Two's Complement, One's Complement, and Sign-Magnitude numbers.
*   **Bit Patterns & Bitwise Operators:** Interactive bitmask playgrounds with real-time shift indicators and logic table diagnostics.

### 🎨 Visual & Educational Classrooms
*   **Binary Tree Visualizer:** Interactive tree node animations showing depth-first and breadth-first search path traversals.
*   **Interactive Number Line:** Real-time fractional-zoom visual slider plotting integer bounds and interval coordinates.
*   **Bytes & Bits Room:** Inspect exact visual representations of byte arrays down to their binary structures.

### 🔐 Text & Security Utilities
*   **Cryptographic Hash Suites:** Fast, client-side generators for MD5, SHA-1, and SHA-256 with copyable hashes.
*   **Base64 Studio:** Encode and decode complex strings, binary structures, or URL components with validation safeguards.
*   **Regex Tester:** Dynamic, live pattern tester complete with status, match groups, and structured test assertions.
*   **UUID Generator:** Highly configurable version 4 UUID batch generation suite.
*   **ASCII & Unicode Decoders:** Comprehensive index tables pairing text glyphs with integers instantly.

---

## ⚡ Ergonomic UX Enhancements

RadixLab is designed around maximum developer productivity:
*   **Fast Section Cycling:** Tap <kbd>↑ Up Arrow</kbd> or <kbd>↓ Down Arrow</kbd> on any non-input area to cascade instantly through the side modules.
*   **Global Hotkeys:** Alt-triggered quick routes (<kbd>Alt + 1</kbd> through <kbd>Alt + 9</kbd>) and shortcuts dashboard (<kbd>Alt + K</kbd>).
*   **Haptic Interface:** Crisp, click feedback animations and responsive UI triggers.
*   **Ambient Glow Themes:** Supports a futuristic **Cosmic Dark** obsidian scheme and a clean, high-contrast **Nordic Light** viewport.

---

## ⚙️ Tech Stack & Architecture

*   **Runtime Framework:** [React 19](https://react.dev/) & [Vite 6](https://vite.dev/)
*   **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict compilation, custom union contracts)
*   **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/) with custom `@import` pipelines and theme variables
*   **Animation System:** [Motion](https://motion.dev/) (Spring-loaded layout transformations, wait-mode routes)
*   **Icons:** [Lucide React](https://lucide.dev/) API

---

## 🔧 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation

1. Clone or download the repository:
   ```bash
   git clone <your-repository-url>
   cd radix-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to interact with RadixLab.

### Building for Production

Compile the application to a high-performance static SPA:
```bash
npm run build
```
The static file artifacts will be generated in the `dist/` folder, ready for deployment to GitHub Pages, Netlify, Vercel, or any static hosting container.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
