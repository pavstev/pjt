# Rsbuild Serve Executor

Fast development server using Rsbuild for Nx projects.

## Usage

```json
{
  "targets": {
    "serve": {
      "executor": "@pjt/nx:rsbuild-serve",
      "options": {
        "mode": "development"
      }
    }
  }
}
```

## Options

- `mode`: Development mode ('development' | 'production')

## Performance

- Instant HMR with Rsbuild
- 5-10x faster than webpack-based serves
- Incremental builds for rapid iteration
