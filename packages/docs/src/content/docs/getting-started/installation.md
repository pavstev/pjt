---
title: Installation Guide
description: Complete setup guide for OpenAgents development environment
---

# Installation Guide

This guide covers the installation and setup of the OpenAgents development environment, including all available profiles and configuration options.

## Prerequisites

Before installing OpenAgents, ensure your system meets these requirements:

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: pnpm, npm, or yarn
- **Git**: Version 2.30 or higher
- **Operating System**: macOS, Linux, or Windows (WSL)

### Development Tools
- **TypeScript**: 5.9+ (included)
- **Nx**: 22.1+ (included)
- **ESLint**: Configured (included)
- **Prettier**: Configured (included)

## Installation Methods

### Option 1: Full Installation (Recommended)

Install the complete OpenAgents environment with all components:

```bash
# Clone the repository
git clone https://github.com/pavstev/pjt.git
cd pjt

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run setup wizard
pnpm cli setup
```

### Option 2: Profile-Based Installation

Choose a specific profile based on your needs:

#### Essential Profile
Minimal setup for basic development:
```bash
pnpm cli install --profile essential
```

**Includes**: Core agents, basic commands, essential standards

#### Developer Profile
Full development environment:
```bash
pnpm cli install --profile developer
```

**Includes**: All agents, advanced tools, comprehensive standards, design skills

#### Business Profile
Documentation and deployment focused:
```bash
pnpm cli install --profile business
```

**Includes**: Documentation tools, release management, business-oriented skills

#### Full Profile
Complete installation with all components:
```bash
pnpm cli install --profile full
```

**Includes**: Everything available in the registry

#### Advanced Profile
Experimental features and comprehensive tooling:
```bash
pnpm cli install --profile advanced
```

**Includes**: All components plus experimental features

### Option 3: Custom Installation

Install specific components individually:

```bash
# Install only core components
pnpm cli install openagent opencoder

# Install with specific tools
pnpm cli install openagent eslint prettier

# Install design capabilities
pnpm cli install frontend-design canvas-design
```

## Profile Comparison

| Feature | Essential | Developer | Business | Full | Advanced |
|---------|-----------|-----------|----------|------|----------|
| Core Agents | ✅ | ✅ | ✅ | ✅ | ✅ |
| Code Tools | Basic | ✅ | Limited | ✅ | ✅ |
| Design Tools | ❌ | ✅ | Limited | ✅ | ✅ |
| Documentation | Basic | ✅ | ✅ | ✅ | ✅ |
| Deployment | ❌ | ✅ | ✅ | ✅ | ✅ |
| Experimental | ❌ | ❌ | ❌ | ❌ | ✅ |
| Component Count | 10 | 45 | 20 | 55 | 55+ |

## Configuration

### Environment Setup

Create environment configuration:

```bash
# Copy example environment file
cp packages/opencode/.env.example packages/opencode/.env

# Edit with your preferences
nano packages/opencode/.env
```

### OpenCode Configuration

Customize OpenCode settings in `opencode.jsonc`:

```jsonc
{
  "theme": "poimandres",
  "autoupdate": "notify",
  "experimental": {
    "hook": {
      "file_edited": {}
    }
  }
}
```

### Agent Configuration

Each agent can be customized in `packages/opencode/agent/{agent-name}.md`:

```yaml
---
description: "Custom agent description"
mode: primary
temperature: 0.2
tools:
  read: true
  write: true
  edit: true
---
```

## Verification

After installation, verify your setup:

```bash
# Check installation
pnpm cli validate

# Test core functionality
pnpm cli openagent "Hello, can you help me?"

# Run comprehensive validation
pnpm cli validate-repo
```

## IDE Integration

### VS Code
1. Install recommended extensions:
   - OpenCode Extension
   - Nx Console
   - ESLint
   - Prettier

2. Configure workspace settings:
```json
{
  "openCode.enable": true,
  "nxConsole.enable": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Other Editors
- **Cursor**: Built-in OpenCode support
- **Zed**: Configure with OpenCode plugin
- **Vim/Neovim**: Use coc-openCode extension

## Project Setup

### New Project
Initialize OpenAgents in a new project:

```bash
# Initialize in current directory
pnpm cli init

# Or specify a directory
pnpm cli init --dir ./my-project
```

### Existing Project
Add OpenAgents to an existing project:

```bash
# Analyze existing codebase
pnpm cli analyze

# Generate configuration
pnpm cli configure

# Install appropriate profile
pnpm cli install --profile developer
```

## Context Files

OpenAgents uses context files for project standards:

### Core Standards
- `code.md`: Code standards and patterns
- `docs.md`: Documentation guidelines
- `tests.md`: Testing methodologies
- `patterns.md`: Design patterns
- `analysis.md`: Code analysis standards

### Workflows
- `delegation.md`: Agent delegation protocols
- `review.md`: Code review processes
- `sessions.md`: Session management
- `task-breakdown.md`: Task decomposition standards

### Project Context
- `project-context.md`: Project-specific information

## Troubleshooting

### Common Installation Issues

**Permission Errors**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use nvm for Node.js
nvm install --lts
nvm use --lts
```

**Build Failures**
```bash
# Clear cache and rebuild
pnpm clean
pnpm install
pnpm build
```

**Context Loading Issues**
```bash
# Verify context files exist
ls -la packages/opencode/context/

# Check file permissions
chmod +r packages/opencode/context/**/*.md
```

### Performance Optimization

For large projects, optimize OpenAgents performance:

```bash
# Enable caching
echo "OPENAGENTS_CACHE=true" >> packages/opencode/.env

# Configure memory limits
echo "NODE_OPTIONS=--max-old-space-size=4096" >> packages/opencode/.env

# Use parallel processing
pnpm cli configure --parallel
```

## Updating

Keep OpenAgents current:

```bash
# Update all components
pnpm update

# Update specific profile
pnpm cli update --profile developer

# Check for new versions
pnpm cli version --check
```

## Uninstallation

Remove OpenAgents from your system:

```bash
# Remove all components
pnpm cli uninstall --all

# Remove configuration
rm -rf packages/opencode/

# Clean dependencies
pnpm clean
```

## Support

### Getting Help
- **Documentation**: Check this guide and agent-specific docs
- **Validation**: Run `pnpm cli validate-repo` for diagnostics
- **Logs**: Check `packages/opencode/logs/` for detailed error information

### Community Resources
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Join community conversations
- **Contributing**: See contribution guidelines for extending OpenAgents

## Next Steps

After installation:

1. **Explore**: Try `pnpm cli openagent "What can you help me with?"`
2. **Customize**: Modify context files for your project standards
3. **Integrate**: Set up IDE integration and git hooks
4. **Extend**: Create custom agents or modify existing ones

Happy coding with OpenAgents! 🚀