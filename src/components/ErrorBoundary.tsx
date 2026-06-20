import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  theme?: 'dark' | 'light';
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      const isDark = this.props.theme !== 'light';
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${
          isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-700'
        }`}>
          <div className={`max-w-md w-full p-8 border rounded-lg shadow-xl text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <AlertOctagon className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-lg font-bold uppercase tracking-wider mb-2">
              DLD Lab Engine Error
            </h1>
            <p className="text-xs text-slate-400 mb-6 font-mono font-medium">
              An unexpected validation anomaly or memory overflow occurred in the client VM container.
            </p>
            <div className={`p-4 rounded text-left font-mono text-xs overflow-auto max-h-40 mb-6 border ${
              isDark ? 'bg-slate-900 border-slate-800 text-rose-400' : 'bg-slate-100 border-slate-200 text-rose-600'
            }`}>
              {this.state.error?.toString() || 'Unknown VM exception'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset System Context
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
