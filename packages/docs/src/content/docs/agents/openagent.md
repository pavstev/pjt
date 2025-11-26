---
title: OpenAgent
description: Universal AI agent for code, docs, tests, and workflow coordination
---

# OpenAgent

OpenAgent is the primary universal agent for the OpenAgents ecosystem, designed to handle queries, execute tasks, and coordinate workflows across any domain, codebase, or project structure.

## Overview

OpenAgent serves as the main entry point for AI-assisted development workflows. It combines intelligent task analysis, context-aware execution, and strategic delegation to specialized subagents to deliver comprehensive development support.

## Core Capabilities

### Universal Coordination
- **Domain Agnostic**: Works across any programming language, framework, or project type
- **Context Aware**: Automatically loads and applies project-specific standards and patterns
- **Workflow Intelligence**: Analyzes requests and determines optimal execution paths

### Task Execution
- **Direct Implementation**: Handles straightforward tasks directly
- **Strategic Delegation**: Routes complex tasks to specialized subagents
- **Quality Assurance**: Enforces approval gates and validation checkpoints

### Safety & Reliability
- **Approval Gates**: Requires explicit user confirmation for destructive operations
- **Context Loading**: Always loads relevant standards before execution
- **Error Handling**: Comprehensive error reporting with fix proposals

## Available Subagents

OpenAgent can delegate to the following specialized subagents:

### Code Subagents
- **Coder Agent**: Executes coding subtasks in sequence
- **Build Agent**: Type check and build validation
- **Tester**: Test authoring and TDD implementation
- **Code Reviewer**: Code review, security, and quality assurance

### Core Subagents
- **Task Manager**: Complex feature breakdown and planning
- **Documentation**: Documentation authoring and maintenance

### Utility Subagents
- **Image Specialist**: Image editing and analysis with Gemini AI

## Delegation Criteria

OpenAgent delegates tasks based on these criteria:

### Scale & Complexity
- **4+ files affected**: Delegates to task-manager for breakdown
- **Multi-step dependencies**: Uses specialized agents for complex workflows
- **Cross-component coordination**: Routes to appropriate specialists

### Expertise Requirements
- **Specialized knowledge**: Delegates to domain experts (security, deployment, etc.)
- **Quality requirements**: Uses dedicated quality assurance agents
- **Performance optimization**: Routes to build and optimization specialists

### User Preferences
- **Explicit requests**: Honors direct delegation requests
- **Fresh perspective**: Delegates for alternative approaches when needed

## Workflow Process

### 1. Analysis Phase
- Assess request type and complexity
- Determine conversational vs. task execution path
- Load relevant context files automatically

### 2. Approval Phase
- Present execution plan for user confirmation
- Require approval for all file modifications
- Allow context review before proceeding

### 3. Execution Phase
- Apply loaded context standards
- Execute tasks or delegate to subagents
- Maintain session state and progress tracking

### 4. Validation Phase
- Verify execution results
- Run automated checks where applicable
- Report issues with fix proposals

### 5. Summary Phase
- Provide clear outcome summary
- Suggest next steps or follow-up actions
- Confirm cleanup of temporary resources

## Context Loading

OpenAgent automatically loads context based on task type:

| Task Type | Context File | Purpose |
|-----------|-------------|---------|
| Code | `standards/code.md` | Code standards and patterns |
| Docs | `standards/docs.md` | Documentation guidelines |
| Tests | `standards/tests.md` | Testing methodologies |
| Review | `workflows/review.md` | Review processes |
| Delegation | `workflows/delegation.md` | Delegation protocols |

## Safety Protocols

### Critical Rules
1. **Context Mandatory**: Never execute without loading required context
2. **Approval Required**: All modifications need user confirmation
3. **Stop on Failure**: Halt execution and report errors immediately
4. **Report First**: Never auto-fix - always propose solutions

### Permission Controls
- **Destructive Operations**: Require explicit approval (rm -rf, sudo, etc.)
- **Sensitive Files**: Block access to .env, .key, .secret files
- **System Files**: Prevent modification of critical system paths

## Integration Points

### OpenCode Ecosystem
- **Agent Registry**: Registered in the central component registry
- **Profile Support**: Available in all installation profiles
- **Context Sharing**: Contributes to and consumes shared context files

### Development Workflow
- **Git Integration**: Works with conventional commits and branching
- **CI/CD Support**: Compatible with automated build and test pipelines
- **Team Collaboration**: Supports multi-developer workflows

## Usage Examples

### Simple Task
```bash
# Direct execution for straightforward tasks
openagent "Add error handling to user authentication"
```

### Complex Feature
```bash
# Delegates to task-manager for breakdown
openagent "Implement user dashboard with real-time updates"
```

### Code Review
```bash
# Delegates to code-review subagent
openagent "Review the authentication module for security issues"
```

## Configuration

OpenAgent respects the following configuration sources:

- **Project Standards**: `packages/opencode/context/core/standards/`
- **Workflow Preferences**: `packages/opencode/context/core/workflows/`
- **Agent Settings**: `packages/opencode/agent/openagent.md`
- **Global Config**: `opencode.jsonc`

## Troubleshooting

### Common Issues

**Context Loading Failures**
- Ensure `packages/opencode/context/` directory exists
- Check file permissions on context files
- Verify context file syntax and structure

**Delegation Errors**
- Confirm subagent definitions exist
- Check subagent availability and compatibility
- Review delegation criteria matching

**Permission Denied**
- Verify user has appropriate file system permissions
- Check if operations require elevated privileges
- Review safety protocol configurations

### Debug Mode

Enable verbose logging for troubleshooting:
```bash
openagent --debug "analyze authentication flow"
```

## Contributing

To extend OpenAgent capabilities:

1. **Add Subagents**: Create new specialized agents following the delegation pattern
2. **Extend Context**: Add domain-specific standards and workflows
3. **Improve Safety**: Enhance permission controls and validation rules
4. **Performance**: Optimize delegation logic and context loading

## Related Documentation

- [Installation Guide](../getting-started/installation.md)
- [Context Standards](../../core/standards/)
- [Workflow Guides](../../core/workflows/)
- [Agent Registry](../../registry.json)