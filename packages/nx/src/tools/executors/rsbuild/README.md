# Rsbuild Plugin for Nx

Custom Nx plugin providing Rsbuild executors for fast builds.

## Installation

```bash
nx add @pjt/nx
```

## Usage

### Build Executor

```json
{
  "targets": {
    "build": {
      "executor": "@pjt/nx:rsbuild-build"
    }
  }
}
```

### Serve Executor

```json
{
  "targets": {
    "serve": {
      "executor": "@pjt/nx:rsbuild-serve"
    }
  }
}
```

### SSR Executor

```json
{
  "targets": {
    "ssr": {
      "executor": "@pjt/nx:rsbuild-ssr"
    }
  }
}
```

## Configuration

### Build Options

- `outputPath`: Output directory
- `mode`: Build mode (development/production)
- `rsbuildConfig`: Path to custom rsbuild config

### Serve Options

- `mode`: Development mode (development/production)

## Performance

- 5-10x faster than tsc builds
- Built on Rspack for extreme speed
- SWC transpilation for fast compilation

## Features

- Fast incremental builds
- Development server with HMR
- SSR support
- Module Federation ready

## Development

To use the custom executors, update your project.json:

```json
{
  "targets": {
    "build": {
      "executor": "@pjt/nx:rsbuild-build"
    }
  },
    "serve": {
      "executor": "@pjt/nx:rsbuild-serve"
    }
  }
}
```

## Configuration

Create a `rsbuild.config.ts` file in your project root:

```typescript
import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    plugins: [
      // Add your custom plugins here
    ],
  },
});
```

## Performance

- 5-10x faster than tsc builds
- Built on Rspack for extreme speed
- SWC transpilation for fast compilation

## Features

- Fast incremental builds
- Development server with HMR
- SSR support
- Module Federation ready
