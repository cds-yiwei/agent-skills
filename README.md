# Agent Skills Repository

A collection of specialized skills for AI coding assistants, designed to extend agent capabilities for specific domains and tasks.

## 📚 Available Skills

### 🇨🇦 [GC Design System](./gc-design-system/)
Build professional Government of Canada websites using the GC Design System (GCDS) web components, CSS shortcuts, and design tokens.

**Use when:** Building Canada.ca websites, federal government web pages, or bilingual government service pages.

**Key Features:**
- GCDS web components library
- Tailwind CSS integration for advanced components
- Accessible, bilingual templates
- Complete component inventory and design tokens

---

### 🔐 [IBM Security Verify](./ibm-security-verify/)
Integration guide for IBM Security Verify identity and access management solutions.

**Use when:** Implementing authentication, SSO, MFA, or identity governance with IBM Security Verify.

**Key Features:**
- Authentication flows
- API integration patterns
- Security best practices

---

### 🔄 [JavaScript to TypeScript Converter](./js-to-ts-converter/)
Comprehensive migration framework for converting JavaScript projects to TypeScript with intelligent strategies, advanced patterns, and verification tools.

**Use when:** Migrating JavaScript projects to TypeScript, modernizing legacy codebases, or adding type safety to existing applications.

**Key Features:**
- Multiple migration strategies (incremental, phased, hybrid)
- Advanced TypeScript patterns and utility types
- Type coverage tracking and monitoring
- Testing and verification strategies
- Monorepo support with project references
- Complete migration best practices and common pitfalls guide

---

## 🚀 Getting Started

### What are Skills?

Skills are specialized instruction sets that extend AI agent capabilities for specific domains. Each skill contains:

- **SKILL.md** - Main instruction file with metadata and detailed guidelines
- **references/** - Technical documentation, API references, and examples
- **assets/** - Templates, starter files, and resources
- **scripts/** - Helper utilities and automation tools (when applicable)

### How to Use Skills

1. **Browse Available Skills** - Review the skills listed above
2. **Read the SKILL.md** - Each skill's `SKILL.md` file contains complete instructions
3. **Follow the Guidelines** - Skills provide decision trees, component guides, and best practices
4. **Use References** - Detailed documentation in `references/` folders
5. **Start with Templates** - Many skills include starter templates in `assets/`

### Skill Structure

```
agent-skills/
├── README.md                          # This file
├── LICENSE                            # License information
├── CONTRIBUTING.md                    # Contribution guidelines
│
├── gc-design-system/                  # Skill directory
│   ├── SKILL.md                       # Main skill instructions
│   ├── references/                    # Technical documentation
│   │   ├── components.md
│   │   ├── css-shortcuts.md
│   │   └── ...
│   └── assets/                        # Templates and resources
│       └── basic-page-template.html
│
├── ibm-security-verify/
│   ├── SKILL.md
│   └── references/
│
└── js-to-ts-converter/
    ├── SKILL.md
    ├── references/
    ├── assets/
    └── scripts/                       # Automation utilities
```

## 🛠️ Creating New Skills

To create a new skill:

1. **Create a directory** with a descriptive kebab-case name
2. **Add SKILL.md** with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Brief description of when and how to use this skill
   ---
   ```
3. **Write detailed instructions** in the SKILL.md body
4. **Organize supporting files**:
   - `references/` - Documentation and API references
   - `assets/` - Templates and starter files
   - `scripts/` - Helper utilities (optional)
5. **Update this README** to list your new skill

### Skill Best Practices

- **Clear triggers** - Define when the skill should be activated
- **Decision guides** - Help agents choose the right approach
- **Complete examples** - Provide working code samples
- **Reference docs** - Include comprehensive API/component documentation
- **Accessibility** - Ensure all generated code follows accessibility standards
- **Maintainability** - Keep skills updated with latest library versions

## 📖 Skill Development Guidelines

### SKILL.md Format

```markdown
---
name: skill-name
description: Clear description with trigger keywords
---

# Skill Title

Brief overview of what this skill does.

## Quick Start
1. Step-by-step getting started guide

## Key Concepts
Important concepts to understand

## Decision Guide
When to use what approach

## References
Links to detailed documentation

## Assets
Available templates and resources
```

### Documentation Standards

- Use clear, concise language
- Include code examples with syntax highlighting
- Provide decision trees for complex choices
- Link to official documentation sources
- Keep version numbers up to date
- Include accessibility considerations

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/new-skill`)
3. Add your skill following the structure above
4. Update this README with your skill details
5. Submit a pull request

### Contribution Checklist

- [ ] SKILL.md includes YAML frontmatter with name and description
- [ ] Clear trigger keywords in description
- [ ] Detailed instructions and examples
- [ ] Supporting documentation in `references/`
- [ ] Templates in `assets/` (if applicable)
- [ ] README.md updated with new skill
- [ ] All code examples tested and working

## 📄 License

[Add your license information here]

## 🔗 Resources

- [AI Agent Best Practices](#)
- [Skill Development Guide](#)
- [Community Forum](#)

## 📞 Support

For questions or issues:
- Open an issue in this repository
- [Add contact information or support channels]

---

**Last Updated:** February 2026
