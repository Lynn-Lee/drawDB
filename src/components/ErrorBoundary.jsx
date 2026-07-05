import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
          <section
            aria-label="发生错误"
            role="alert"
            className="max-w-md text-center"
          >
            <h1 className="mb-3 text-2xl font-semibold">
              发生错误
            </h1>
            <p className="text-sm text-zinc-300">
              重新加载此页面可恢复编辑器。除非清除站点数据，本地图表会继续保留在当前浏览器中。
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
