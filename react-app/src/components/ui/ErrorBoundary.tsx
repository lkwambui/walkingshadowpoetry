import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Walking Shadow Poetry runtime error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center text-ink">
          <p className="eyebrow mb-6 text-terracotta">Something went quiet</p>
          <h1 className="max-w-xl font-display text-5xl leading-none sm:text-7xl">
            The page lost its thread.
          </h1>
          <p className="mt-6 max-w-md text-sm text-ink/60">
            Please refresh the page or return home. If the problem continues, reach us at{' '}
            <a className="link-underline text-terracotta" href="mailto:precoiusowoko@gmail.com">
              precoiusowoko@gmail.com
            </a>
            .
          </p>
          <a
            href="/"
            className="mt-10 border border-ink px-7 py-4 text-[0.68rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
          >
            Return home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}
