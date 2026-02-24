#!/usr/bin/env node

/**
 * Analyzes project code and generates types based on ACTUAL usage patterns
 * Extracts interfaces from object shapes, function signatures, and API calls
 * Creates project-specific types instead of generic templates
 */

const fs = require('fs');
const path = require('path');
const {
  formatError,
  formatSuccess,
  formatInfo,
  formatWarning,
  validatePrerequisites,
  parseArgs
} = require('./error-utils');

// Patterns to detect type shapes in code
const TYPE_PATTERNS = {
  // Object literal patterns
  objectLiteral: /(?:const|let|var)\s+(\w+)\s*=\s*\{[\s\S]*?\}/g,
  
  // Function parameter destructuring
  functionParams: /(?:function\s+\w+|\w+\s*=>)\s*\(\s*\{\s*([^}]+)\s*\}\s*\)/g,
  
  // API response assignments
  apiResponse: /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:fetch|axios|http)\.[a-z]+\s*\([^)]*\)/g,
  
  // Class properties
  classProps: /(?:public|private|protected)?\s*(\w+)\??\s*:\s*(\w+)/g,
  
  // JSDoc types
  jsdocType: /@(?:param|returns?|type)\s*\{([^}]+)\}\s*(\w+)?/g,
  
  // PropTypes (React)
  propTypes: /(\w+)\.propTypes\s*=\s*\{[\s\S]*?\}/g,
  
  // Common object property patterns
  userProps: /(?:user|User)\.(?:id|name|email|username|avatar|role)/,
  configProps: /(?:config|Config)\.(?:env|port|host|api|url)/,
  errorProps: /(?:error|Error)\.(?:message|code|status|stack)/,
  paginationProps: /(?:page|limit|offset|total|pageSize|totalPages)/,
};

// Test file patterns to exclude
const TEST_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /__tests__/,
  /__mocks__/,
  /\.e2e\./,
  /test\//,
  /tests\//,
  /__tests__\//
];

function isTestFile(filePath) {
  return TEST_PATTERNS.some(pattern => pattern.test(filePath));
}

function findAllJsFiles(rootDir) {
  const files = [];
  
  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules, dist, build, .git
          if (!['node_modules', 'dist', 'build', '.git', 'coverage', '.next', '.nuxt'].includes(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            if (!isTestFile(fullPath)) {
              files.push(fullPath);
            }
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  walk(rootDir);
  return files;
}

function extractObjectShape(content, startIndex) {
  let braceCount = 1;
  let endIndex = startIndex + 1;
  
  while (braceCount > 0 && endIndex < content.length) {
    if (content[endIndex] === '{') braceCount++;
    if (content[endIndex] === '}') braceCount--;
    endIndex++;
  }
  
  return content.substring(startIndex, endIndex);
}

function parseObjectShape(objectStr) {
  const properties = [];
  const propPattern = /(\w+)\??\s*:\s*([^,\n\}]+)/g;
  let match;
  
  while ((match = propPattern.exec(objectStr)) !== null) {
    properties.push({
      name: match[1],
      type: inferTypeFromValue(match[2].trim()),
      optional: objectStr.includes(`${match[1]}?`) || objectStr.includes(`${match[1]} = `)
    });
  }
  
  return properties;
}

function inferTypeFromValue(value) {
  value = value.trim();
  
  // Handle string literals
  if (/^['"`]/.test(value)) return 'string';
  
  // Handle numbers
  if (/^-?\d+\.?\d*$/.test(value)) return 'number';
  
  // Handle booleans
  if (/^(true|false)$/.test(value)) return 'boolean';
  
  // Handle arrays
  if (/^\[/.test(value)) {
    if (value === '[]') return 'unknown[]';
    return 'Array<unknown>';
  }
  
  // Handle objects
  if (/^\{/.test(value)) return 'Record<string, unknown>';
  
  // Handle null/undefined
  if (/^(null|undefined)$/.test(value)) return 'null';
  
  // Handle functions
  if (/^\(?\w+\)?\s*=>/.test(value) || /^function\s*\(/.test(value)) {
    return 'Function';
  }
  
  // Default
  return 'unknown';
}

function analyzeFile(filePath) {
  const result = {
    file: filePath,
    objects: [],
    functions: [],
    apiEndpoints: [],
    jsdocTypes: [],
    propTypes: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract object literals with their shapes
    let match;
    const objectRegex = /(?:const|let|var)\s+(\w+)\s*:\s*\{/g;
    while ((match = objectRegex.exec(content)) !== null) {
      const objectName = match[1];
      const objectBody = extractObjectShape(content, match.index + match[0].length - 1);
      const properties = parseObjectShape(objectBody);
      
      if (properties.length > 0) {
        result.objects.push({
          name: objectName,
          properties,
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
    
    // Extract function signatures
    const functionRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:function)?\s*\()\s*\(/g;
    while ((match = functionRegex.exec(content)) !== null) {
      const funcName = match[1] || match[2];
      const paramsStart = match.index + match[0].length - 1;
      const paramsEnd = findMatchingParen(content, paramsStart);
      
      if (paramsEnd > paramsStart) {
        const params = content.substring(paramsStart + 1, paramsEnd);
        const paramList = parseParameters(params);
        
        result.functions.push({
          name: funcName,
          parameters: paramList,
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
    
    // Extract API calls
    const apiRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(fetch|axios\.\w+)\s*\(/g;
    while ((match = apiRegex.exec(content)) !== null) {
      const responseVar = match[1];
      const httpMethod = match[2];
      
      result.apiEndpoints.push({
        variable: responseVar,
        method: httpMethod,
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    // Extract JSDoc types
    const jsdocRegex = /@(?:param|returns?)\s*\{([^}]+)\}\s*(\w+)?/g;
    while ((match = jsdocRegex.exec(content)) !== null) {
      result.jsdocTypes.push({
        type: match[1],
        name: match[2],
        line: content.substring(0, match.index).split('\n').length
      });
    }
    
    // Extract PropTypes (React)
    if (content.includes('PropTypes')) {
      const propTypesRegex = /(\w+)\.propTypes\s*=\s*\{/g;
      while ((match = propTypesRegex.exec(content)) !== null) {
        const componentName = match[1];
        const bodyStart = match.index + match[0].length - 1;
        const bodyEnd = findMatchingBrace(content, bodyStart);
        
        if (bodyEnd > bodyStart) {
          const body = content.substring(bodyStart, bodyEnd + 1);
          const props = parsePropTypes(body);
          
          result.propTypes.push({
            component: componentName,
            props,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    }
    
  } catch (error) {
    result.error = error.message;
  }
  
  return result;
}

function findMatchingParen(content, start) {
  let count = 1;
  let i = start + 1;
  
  while (count > 0 && i < content.length) {
    if (content[i] === '(') count++;
    if (content[i] === ')') count--;
    i++;
  }
  
  return count === 0 ? i - 1 : -1;
}

function findMatchingBrace(content, start) {
  let count = 1;
  let i = start + 1;
  
  while (count > 0 && i < content.length) {
    if (content[i] === '{') count++;
    if (content[i] === '}') count--;
    i++;
  }
  
  return count === 0 ? i - 1 : -1;
}

function parseParameters(paramsStr) {
  const params = [];
  const paramPattern = /(\w+)\??(?:\s*:\s*(\w+))?/g;
  let match;
  
  while ((match = paramPattern.exec(paramsStr)) !== null) {
    params.push({
      name: match[1],
      type: match[2] || 'unknown',
      optional: paramsStr.includes(`${match[1]}?`) || paramsStr.includes(`${match[1]} = `)
    });
  }
  
  return params;
}

function parsePropTypes(body) {
  const props = [];
  const propPattern = /(\w+)\s*:\s*PropTypes\.(\w+)/g;
  let match;
  
  const typeMapping = {
    'string': 'string',
    'number': 'number',
    'bool': 'boolean',
    'func': 'Function',
    'array': 'unknown[]',
    'object': 'Record<string, unknown>',
    'node': 'React.ReactNode',
    'element': 'React.ReactElement',
    'any': 'unknown'
  };
  
  while ((match = propPattern.exec(body)) !== null) {
    props.push({
      name: match[1],
      type: typeMapping[match[2]] || 'unknown',
      required: !body.includes(`${match[1]}: PropTypes.${match[2]}`) || body.includes('.isRequired')
    });
  }
  
  return props;
}

function categorizeTypes(analysisResults) {
  const categories = {
    api: [],
    domain: [],
    config: [],
    ui: [],
    utility: []
  };
  
  for (const result of analysisResults) {
    // Categorize objects
    for (const obj of result.objects) {
      const category = categorizeObject(obj.name, obj.properties);
      if (category) {
        categories[category].push(obj);
      }
    }
    
    // Categorize PropTypes as UI
    for (const pt of result.propTypes) {
      categories.ui.push({
        name: `${pt.component}Props`,
        properties: pt.props,
        component: pt.component
      });
    }
  }
  
  return categories;
}

function categorizeObject(name, properties) {
  const nameLower = name.toLowerCase();
  const propNames = properties.map(p => p.name.toLowerCase());
  
  // API/Response types
  if (nameLower.includes('response') || nameLower.includes('result') || 
      nameLower.includes('data') || propNames.includes('data') && propNames.includes('status')) {
    return 'api';
  }
  
  // Domain/User types
  if (nameLower.includes('user') || nameLower.includes('account') || nameLower.includes('profile') ||
      propNames.includes('email') && propNames.includes('username')) {
    return 'domain';
  }
  
  // Config types
  if (nameLower.includes('config') || nameLower.includes('options') || nameLower.includes('settings') ||
      propNames.includes('env') || propNames.includes('port')) {
    return 'config';
  }
  
  // UI types
  if (nameLower.includes('props') || nameLower.includes('style') || nameLower.includes('theme') ||
      propNames.includes('className') || propNames.includes('onClick')) {
    return 'ui';
  }
  
  // Utility/Other
  return 'utility';
}

function generateTypeDefinitions(categories, projectType) {
  const definitions = [];
  
  // Generate API types
  if (categories.api.length > 0) {
    const apiTypes = generateApiTypes(categories.api);
    definitions.push({ name: 'api.types.ts', content: apiTypes });
  }
  
  // Generate Domain types
  if (categories.domain.length > 0) {
    const domainTypes = generateDomainTypes(categories.domain);
    definitions.push({ name: 'domain.types.ts', content: domainTypes });
  }
  
  // Generate Config types
  if (categories.config.length > 0) {
    const configTypes = generateConfigTypes(categories.config);
    definitions.push({ name: 'config.types.ts', content: configTypes });
  }
  
  // Generate UI types (React-specific)
  if (projectType === 'react' && categories.ui.length > 0) {
    const uiTypes = generateUiTypes(categories.ui);
    definitions.push({ name: 'components.types.ts', content: uiTypes });
  }
  
  // Generate Utility types
  if (categories.utility.length > 0) {
    const utilityTypes = generateUtilityTypes(categories.utility);
    definitions.push({ name: 'utils.types.ts', content: utilityTypes });
  }
  
  return definitions;
}

function generateApiTypes(apiObjects) {
  const lines = [
    '/**',
    ' * API Response Types',
    ' * Auto-generated from project code analysis',
    ' */',
    ''
  ];
  
  for (const obj of apiObjects) {
    lines.push(`export interface ${capitalize(obj.name)} {`);
    for (const prop of obj.properties) {
      const optional = prop.optional ? '?' : '';
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}', '');
  }
  
  return lines.join('\n');
}

function generateDomainTypes(domainObjects) {
  const lines = [
    '/**',
    ' * Domain Model Types',
    ' * Auto-generated from project code analysis',
    ' */',
    ''
  ];
  
  for (const obj of domainObjects) {
    lines.push(`export interface ${capitalize(obj.name)} {`);
    for (const prop of obj.properties) {
      const optional = prop.optional ? '?' : '';
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}', '');
  }
  
  return lines.join('\n');
}

function generateConfigTypes(configObjects) {
  const lines = [
    '/**',
    ' * Configuration Types',
    ' * Auto-generated from project code analysis',
    ' */',
    ''
  ];
  
  for (const obj of configObjects) {
    lines.push(`export interface ${capitalize(obj.name)} {`);
    for (const prop of obj.properties) {
      const optional = prop.optional ? '?' : '';
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}', '');
  }
  
  return lines.join('\n');
}

function generateUiTypes(uiObjects) {
  const lines = [
    '/**',
    ' * Component Props Types',
    ' * Auto-generated from PropTypes analysis',
    ' */',
    '',
    "import React from 'react';",
    ''
  ];
  
  for (const obj of uiObjects) {
    const interfaceName = obj.name || `${capitalize(obj.component)}Props`;
    lines.push(`export interface ${interfaceName} {`);
    for (const prop of obj.properties) {
      const optional = prop.required ? '' : '?';
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}', '');
  }
  
  return lines.join('\n');
}

function generateUtilityTypes(utilityObjects) {
  const lines = [
    '/**',
    ' * Utility Types',
    ' * Auto-generated from project code analysis',
    ' */',
    ''
  ];
  
  for (const obj of utilityObjects) {
    lines.push(`export interface ${capitalize(obj.name)} {`);
    for (const prop of obj.properties) {
      const optional = prop.optional ? '?' : '';
      lines.push(`  ${prop.name}${optional}: ${prop.type};`);
    }
    lines.push('}', '');
  }
  
  return lines.join('\n');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectProjectType(rootDir) {
  const packageJsonPath = path.join(rootDir, 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps['vue'] || deps['@vue/runtime-core']) {
      return 'vue3';
    } else if (deps['react'] || deps['react-dom'] || deps['next']) {
      return 'react';
    } else if (deps['express'] || deps['fastify'] || deps['koa'] || deps['@nestjs/core']) {
      return 'node';
    }
  } catch {
    // Ignore errors
  }
  
  return 'vanilla';
}

function createTypesDirectory(rootDir) {
  const typesDir = path.join(rootDir, 'src', 'types');
  
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }
  
  return typesDir;
}

function writeTypeFiles(typesDir, definitions) {
  const written = [];
  
  for (const def of definitions) {
    const filePath = path.join(typesDir, def.name);
    
    // Don't overwrite existing files
    if (fs.existsSync(filePath)) {
      console.error(formatWarning(`Skipping ${def.name} (already exists)`));
      continue;
    }
    
    fs.writeFileSync(filePath, def.content);
    written.push(def.name);
    console.error(formatSuccess(`Created: ${def.name}`));
  }
  
  return written;
}

function generateIndexFile(typesDir, filenames) {
  const indexPath = path.join(typesDir, 'index.ts');
  
  const exports = filenames.map(name => {
    const baseName = name.replace('.ts', '');
    return `export * from './${baseName}';`;
  });
  
  const content = `/**
 * Types index
 * Auto-generated from project code analysis
 */

${exports.join('\n')}
`;
  
  fs.writeFileSync(indexPath, content);
  console.error(formatSuccess('Created: index.ts'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rootDir = args.positional[0] || process.cwd();
  const verbose = args.options.verbose || args.options.v || false;
  
  console.error('=== Analyzing Project and Generating Types ===\n');
  
  // Validate prerequisites
  const errors = validatePrerequisites(rootDir, { packageJson: true });
  if (errors.length > 0) {
    console.error(formatError(new Error(errors.join('\n')), 'Prerequisites'));
    process.exit(1);
  }
  
  // Detect project type
  const projectType = detectProjectType(rootDir);
  console.error(formatInfo(`Detected project type: ${projectType}`));
  
  // Find all JS/TS files
  console.error(formatInfo('Finding source files...'));
  const files = findAllJsFiles(rootDir);
  console.error(formatSuccess(`Found ${files.length} source files`));
  
  if (files.length === 0) {
    console.error(formatWarning('No source files found'));
    process.exit(0);
  }
  
  // Analyze each file
  console.error(formatInfo('Analyzing code for type patterns...'));
  const analysisResults = [];
  
  for (const file of files) {
    if (verbose) {
      console.error(`  Analyzing: ${path.relative(rootDir, file)}`);
    }
    const result = analyzeFile(file);
    analysisResults.push(result);
  }
  
  // Categorize types
  console.error(formatInfo('Categorizing detected types...'));
  const categories = categorizeTypes(analysisResults);
  
  const totalTypes = Object.values(categories).flat().length;
  console.error(formatSuccess(`Found ${totalTypes} type definitions`));
  
  if (totalTypes === 0) {
    console.error(formatWarning('No type patterns detected in your code.'));
    console.error('This might mean:');
    console.error('  - Your code uses minimal type annotations');
    console.error('  - Objects are defined inline without variable assignments');
    console.error('  - Consider adding JSDoc comments to help type inference');
    process.exit(0);
  }
  
  // Generate type definitions
  console.error(formatInfo('Generating TypeScript definitions...'));
  const definitions = generateTypeDefinitions(categories, projectType);
  
  // Create types directory
  const typesDir = createTypesDirectory(rootDir);
  console.error(formatInfo(`Types directory: ${path.relative(rootDir, typesDir)}`));
  
  // Write type files
  const written = writeTypeFiles(typesDir, definitions);
  
  if (written.length > 0) {
    // Generate index file
    generateIndexFile(typesDir, written);
    
    console.error('\n=== Summary ===');
    console.error(formatSuccess(`Generated ${written.length} type files:`));
    written.forEach(f => console.error(`  - ${f}`));
    console.error('\nNext steps:');
    console.error('  1. Review generated types in src/types/');
    console.error('  2. Refine types as needed');
    console.error('  3. Import types: import { YourType } from "./types";');
  } else {
    console.error(formatInfo('All type files already exist. No new files created.'));
  }
  
  // Output result
  const result = {
    success: true,
    projectType,
    filesAnalyzed: files.length,
    typesDetected: totalTypes,
    filesGenerated: written,
    typesDir: path.relative(rootDir, typesDir)
  };
  
  console.log(JSON.stringify(result, null, 2));
}

main();
