import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            pjt
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            A powerful cross-platform CLI tool for maintaining clean Git repositories.
            Clean ignored files and reinstall dependencies with support for npm, pnpm, yarn, and bun.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/docs"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/pavstev/pjt"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-4">🧹</div>
            <h3 className="text-xl font-semibold mb-2">Git Cleanup</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Automatically clean ignored files and directories from your Git repositories
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Smart Dependencies</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Detect and reinstall dependencies using your preferred package manager
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Workflow Automation</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Run format, lint, build, and test commands with a single tool
            </p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Install pjt globally and start maintaining clean repositories today.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 max-w-md mx-auto border border-slate-200 dark:border-slate-700">
            <code className="text-sm font-mono">npm install -g pjt</code>
          </div>
        </div>
      </div>
    </div>
  );
}