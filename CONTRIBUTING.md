# 🤝 Contributing to RadixLab

Thank you for your interest in contributing to **RadixLab**! We are excited to build a premier, precise, and visual playground for computer engineering calculations together.

To keep the codebase elegant, robust, and clean, please review the contribution guidelines below before submitting pull requests or raising issues.

---

## 🧭 How Can I Contribute?

### 1. Reporting Bugs
*   Ensure the bug hasn't already been reported under **Issues**.
*   Raise an issue detailing the exact steps to reproduce the bug.
*   Include expected vs. actual behaviors, and details about your operating system or browser client.

### 2. Suggesting Features
*   Open an issue to discuss your proposal before starting implementation.
*   Explain the user-experience benefit, architectural impact, and use cases clearly.

### 3. Submitting Pull Requests
*   Fork the repository to your own GitHub account.
*   Create a clean, descriptive feature branch: `git checkout -b feature/your-awesome-feature`.
*   Commit your changes with clear, descriptive commit messages.
*   Ensure all tests and linters pass cleanly (see [Development Setup](#-development-setup)).
*   Open a Pull Request (PR) against the `main` branch of this repository.

---

## 🛠️ Development Setup

Getting your local environment up and running takes less than 2 minutes:

1.  **Clone your fork:**
    ```bash
    git clone https://github.com/<your-username>/radix-lab.git
    cd radix-lab
    ```

2.  **Install dependencies:**
    We recommend using standard npm package management:
    ```bash
    npm install
    ```

3.  **Start the local sandbox:**
    ```bash
    npm run dev
    ```
    This fires up Vite at `http://localhost:3000` with hot-reloading support active.

4.  **Static Build & Verification:**
    Make sure compilation is error-free before making a PR:
    ```bash
    npm run lint
    npm run build
    ```

---

## 🎨 Design & Coding Standards

We maintain high architectural and design standards to ensure RadixLab remains premium, performant, and visual:

### 🧩 Typography & Colors
*   **Theme Continuity:** Keep elements styled with our customized **Cosmic Dark** obsidian scheme or the crisp **Nordic Light** viewport using standard Tailwind CSS classes.
*   **Typography Pairing:** Use the `--font-sans` ("Inter") font family for layouts and standard text blocks, and the `--font-mono` ("JetBrains Mono" or "Fira Code") font family for math states, hex structures, hashes, and binary digit strings.

### ⚛️ Functional Components
*   Implement clean, responsive **React 19 functional components** using Hooks.
*   Avoid inline styles and deep CSS code files—keep styling entirely within Tailwind utility classes.
*   Avoid unnecessary re-renders inside `useEffect` arrays by keeping dependencies focused on primitive type states.

### ⚙️ TypeScript Safety
*   Avoid using the `any` keyword. Use strict, specific typescript interfaces.
*   Define brand-new shared models or visual modes inside `src/types.ts` to prevent duplicate declarations.

---

## 📜 Code of Conduct

Help us foster a welcoming, supportive, and inclusive engineering community:
*   Be respectful, professional, and empathetic.
*   Provide constructive, encouraging feedback during code reviews.
*   Focus on collective success and robust tools.

Thank you again for building RadixLab with us! 🧪🚀
