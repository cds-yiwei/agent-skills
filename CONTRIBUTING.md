# Contributing to Agent Skills

Thank you for your interest in contributing to the Agent Skills repository! This document provides guidelines for creating and maintaining skills.

## 🎯 What Makes a Good Skill?

A good skill should:

1. **Solve a specific problem** - Address a clear use case or domain
2. **Be well-documented** - Include comprehensive instructions and examples
3. **Be maintainable** - Use current versions and best practices
4. **Be accessible** - Follow accessibility standards (WCAG 2.1 AA minimum)
5. **Be reusable** - Provide templates and patterns that work across projects

## 📋 Skill Submission Process

### 1. Planning Your Skill

Before creating a skill, consider:

- **Target audience** - Who will use this skill?
- **Trigger conditions** - When should an AI agent activate this skill?
- **Scope** - What's included and what's not?
- **Dependencies** - What libraries, frameworks, or tools are required?
- **Maintenance** - Can you keep this updated?

### 2. Skill Structure

Create your skill directory with this structure:

```
your-skill-name/
├── SKILL.md                 # Required: Main instruction file
├── references/              # Recommended: Detailed documentation
│   ├── api-reference.md
│   ├── components.md
│   └── examples.md
├── assets/                  # Optional: Templates and resources
│   └── starter-template.html
└── scripts/                 # Optional: Helper utilities
    └── automation-script.js
```

### 3. Writing SKILL.md

Your `SKILL.md` must include:

#### YAML Frontmatter (Required)

```yaml
---
name: your-skill-name
description: Clear, concise description with trigger keywords. Should explain when to use this skill and what it does. Include domain-specific terms that would trigger this skill.
---
```

#### Content Sections (Recommended)

```markdown
# Skill Title

Brief overview (1-2 sentences).

## Quick Start
Step-by-step instructions to get started immediately.

## [Domain] Concepts
Key concepts specific to this skill's domain.

## Component/Tool Decision Guide
When to use what approach (decision tree format).

## Key Rules
Critical guidelines and constraints.

## References
Table linking to detailed documentation files.

## Assets
Table listing available templates and resources.
```

### 4. Documentation Standards

#### Writing Style

- **Clear and concise** - Avoid jargon unless necessary
- **Action-oriented** - Use imperative mood ("Use X for Y")
- **Structured** - Use headers, lists, and tables
- **Examples-rich** - Include code samples for all major concepts

#### Code Examples

- Use proper syntax highlighting with language tags
- Include complete, working examples
- Add comments explaining non-obvious parts
- Test all code before submitting

Example:
````markdown
```html
<!-- GC Design System header example -->
<gcds-header lang="en" lang-href="/fr/page">
  <gcds-search slot="search"></gcds-search>
</gcds-header>
```
````

#### Reference Documentation

Create separate files in `references/` for:

- **API references** - Complete API documentation
- **Component catalogs** - All available components with examples
- **Configuration guides** - Setup and configuration options
- **Best practices** - Domain-specific guidelines
- **Examples** - Real-world usage patterns

### 5. Creating Templates and Assets

If your skill includes templates:

- Place them in `assets/` directory
- Make them complete and ready to use
- Include comments explaining customization points
- Test templates in real scenarios
- Document template usage in SKILL.md

### 6. Adding Helper Scripts

If your skill includes automation scripts:

- Place them in `scripts/` directory
- Include clear usage instructions
- Add error handling and validation
- Document all parameters and options
- Provide example usage

## 🔍 Quality Checklist

Before submitting your skill, verify:

### Documentation
- [ ] SKILL.md has valid YAML frontmatter
- [ ] Description includes clear trigger keywords
- [ ] Quick Start section provides immediate value
- [ ] All code examples are tested and working
- [ ] References are organized and complete
- [ ] Links to external resources are valid

### Structure
- [ ] Directory name uses kebab-case
- [ ] File organization follows conventions
- [ ] No unnecessary files (build artifacts, IDE configs, etc.)
- [ ] All paths use relative links

### Code Quality
- [ ] All examples follow best practices
- [ ] Code is accessible (WCAG 2.1 AA minimum)
- [ ] Modern syntax and current library versions
- [ ] Proper error handling in scripts
- [ ] Comments explain complex logic

### Completeness
- [ ] README.md updated with new skill
- [ ] All referenced files exist
- [ ] Templates are complete and usable
- [ ] No placeholder content (TODOs, FIXMEs)

## 🚀 Submission Guidelines

### Creating a Pull Request

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/agent-skills.git
   cd agent-skills
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-skill-name
   ```

3. **Add your skill**
   - Create skill directory
   - Write SKILL.md
   - Add references and assets
   - Test everything

4. **Update README.md**
   - Add your skill to the "Available Skills" section
   - Follow the existing format
   - Include emoji, title, description, and key features

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add [skill-name] skill"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-skill-name
   ```
   Then create a pull request on GitHub.

### PR Description Template

```markdown
## Skill: [Your Skill Name]

### Description
Brief description of what this skill does.

### Use Cases
- Use case 1
- Use case 2

### Contents
- [x] SKILL.md with frontmatter
- [x] References documentation
- [ ] Assets/templates (if applicable)
- [ ] Scripts (if applicable)

### Testing
Describe how you tested this skill.

### Additional Notes
Any other relevant information.
```

## 🔄 Updating Existing Skills

When updating an existing skill:

1. **Check for breaking changes** - Ensure updates don't break existing usage
2. **Update version numbers** - If referencing specific library versions
3. **Test thoroughly** - Verify all examples still work
4. **Document changes** - Note what changed and why
5. **Update references** - Keep external links current

## 📝 Style Guide

### Naming Conventions

- **Directories**: `kebab-case` (e.g., `gc-design-system`)
- **Files**: `kebab-case.md` (e.g., `api-reference.md`)
- **Skill names**: Match directory name

### Markdown Formatting

- Use ATX-style headers (`#` not underlines)
- Use fenced code blocks with language tags
- Use tables for structured data
- Use emoji sparingly for visual hierarchy (✅ ❌ 📚 🚀 etc.)

### Code Formatting

- **HTML**: 2-space indentation
- **JavaScript/TypeScript**: 2-space indentation
- **CSS**: 2-space indentation
- **JSON**: 2-space indentation

## 🐛 Reporting Issues

Found a problem with an existing skill?

1. **Check existing issues** - Avoid duplicates
2. **Create detailed report** - Include:
   - Skill name and file
   - Expected behavior
   - Actual behavior
   - Steps to reproduce
   - Environment details (if relevant)

## 💡 Suggesting Improvements

Have an idea for improving a skill?

1. **Open an issue** describing the improvement
2. **Explain the benefit** - Why is this better?
3. **Provide examples** - Show what you mean
4. **Offer to implement** - PRs welcome!

## 🏆 Recognition

Contributors will be recognized in:
- Repository contributors list
- Skill documentation (if significant contribution)
- Release notes

## 📞 Questions?

- Open an issue with the `question` label
- [Add contact information or community channels]

---

Thank you for contributing to Agent Skills! 🎉
