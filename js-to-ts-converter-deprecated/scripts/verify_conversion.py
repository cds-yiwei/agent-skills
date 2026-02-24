#!/usr/bin/env python3
"""
Verify TypeScript conversion by running tests and checking for common issues.
Checks TypeScript compilation, test execution, and common conversion problems.
"""

import subprocess
import sys
import argparse
import json
from pathlib import Path


def run_command(cmd, cwd=None, capture=True):
    """Run a shell command and return result."""
    try:
        if capture:
            result = subprocess.run(
                cmd,
                shell=True,
                cwd=cwd,
                capture_output=True,
                text=True,
                timeout=120
            )
            return result.returncode, result.stdout, result.stderr
        else:
            result = subprocess.run(
                cmd,
                shell=True,
                cwd=cwd,
                timeout=300
            )
            return result.returncode, "", ""
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return -1, "", str(e)


def check_typescript_compiler(project_path):
    """Check if TypeScript compiles without errors."""
    print("Checking TypeScript compilation...")
    
    # Try different TypeScript check commands
    commands = [
        "npx tsc --noEmit",
        "npx tsc --noEmit --skipLibCheck",
        "./node_modules/.bin/tsc --noEmit",
    ]
    
    stdout = ""
    stderr = ""
    for cmd in commands:
        returncode, stdout, stderr = run_command(cmd, cwd=project_path)
        if returncode == 0:
            return {'success': True, 'command': cmd, 'output': stdout}
    
    # All commands failed, return the last error
    return {
        'success': False,
        'command': commands[0],
        'output': stdout + stderr
    }


def run_tests(project_path):
    """Run the test suite."""
    print("Running tests...")
    
    # Detect test runner
    test_commands = [
        ("npm test", "package.json"),
        ("npx jest", "jest.config.js"),
        ("npx jest", "jest.config.ts"),
        ("npx mocha", ".mocharc.js"),
        ("npx vitest run", "vitest.config.js"),
        ("npx vitest run", "vitest.config.ts"),
    ]
    
    for cmd, config_file in test_commands:
        config_path = Path(project_path) / config_file
        if config_path.exists():
            returncode, stdout, stderr = run_command(cmd, cwd=project_path)
            return {
                'success': returncode == 0,
                'command': cmd,
                'output': stdout + stderr
            }
    
    # Try npm test as fallback
    returncode, stdout, stderr = run_command("npm test", cwd=project_path)
    return {
        'success': returncode == 0,
        'command': 'npm test',
        'output': stdout + stderr
    }


def check_imports(project_path):
    """Check for common import issues after conversion."""
    print("Checking for import issues...")
    
    issues = []
    project_path = Path(project_path)
    
    # Find all TypeScript files
    ts_files = list(project_path.rglob("*.ts")) + list(project_path.rglob("*.tsx"))
    
    for ts_file in ts_files:
        if 'node_modules' in str(ts_file):
            continue
            
        try:
            content = ts_file.read_text()
            
            # Check for require() statements (should be converted to import)
            if 'require(' in content and 'import ' not in content:
                issues.append({
                    'file': str(ts_file),
                    'type': 'require_statement',
                    'message': 'File uses require() without import statements'
                })
            
            # Check for .js extensions in imports (should be .ts or no extension)
            if '.js\'' in content or '.js"' in content:
                issues.append({
                    'file': str(ts_file),
                    'type': 'js_extension_import',
                    'message': 'Import uses .js extension instead of .ts or no extension'
                })
                
        except Exception:
            continue
    
    return issues


def check_any_types(project_path):
    """Check for both explicit and implicit 'any' type usage."""
    print("Checking for 'any' type usage (explicit and implicit)...")
    
    any_usages = []
    implicit_any_patterns = []
    project_path = Path(project_path)
    
    # Find all TypeScript files
    ts_files = list(project_path.rglob("*.ts")) + list(project_path.rglob("*.tsx"))
    
    for ts_file in ts_files:
        if 'node_modules' in str(ts_file):
            continue
            
        try:
            content = ts_file.read_text()
            lines = content.split('\n')
            
            for i, line in enumerate(lines, 1):
                # Check for explicit 'any' types
                if ': any' in line or 'as any' in line:
                    any_usages.append({
                        'file': str(ts_file),
                        'line': i,
                        'code': line.strip(),
                        'type': 'explicit'
                    })
                
                # Check for patterns that might cause implicit any
                # Function parameters without types in non-arrow functions
                stripped = line.strip()
                if ('function ' in stripped or 'async function ' in stripped) and '(' in stripped:
                    # Check if function has parameters but no type annotations
                    if '(' in stripped and ')' in stripped and ':' not in stripped.split(')')[0]:
                        # Skip if it's a simple function with no params or has type annotation
                        params_part = stripped.split('(')[1].split(')')[0] if '(' in stripped else ''
                        if params_part and not all(p.strip() == '' for p in params_part.split(',')):
                            if not any(keyword in stripped for keyword in ['=>', ': void', ': Promise']):
                                implicit_any_patterns.append({
                                    'file': str(ts_file),
                                    'line': i,
                                    'code': line.strip(),
                                    'type': 'implicit_function_param'
                                })
                
        except Exception:
            continue
    
    return {
        'explicit': any_usages,
        'implicit': implicit_any_patterns,
        'total': len(any_usages) + len(implicit_any_patterns)
    }


def main():
    parser = argparse.ArgumentParser(
        description='Verify TypeScript conversion and check for issues'
    )
    parser.add_argument(
        'project_path',
        nargs='?',
        default='.',
        help='Path to the project root (default: current directory)'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output results as JSON'
    )
    parser.add_argument(
        '--skip-tests',
        action='store_true',
        help='Skip running tests'
    )
    parser.add_argument(
        '--skip-compiler',
        action='store_true',
        help='Skip TypeScript compiler check'
    )
    
    args = parser.parse_args()
    
    project_path = Path(args.project_path).resolve()
    
    if not (project_path / "package.json").exists():
        print(f"Error: No package.json found in {project_path}", file=sys.stderr)
        return 1
    
    results = {
        'project_path': str(project_path),
        'checks': {}
    }
    
    # TypeScript compiler check
    if not args.skip_compiler:
        results['checks']['typescript'] = check_typescript_compiler(project_path)
    
    # Test suite check
    if not args.skip_tests:
        results['checks']['tests'] = run_tests(project_path)
    
    # Import issues check
    results['checks']['import_issues'] = check_imports(project_path)
    
    # Any type usage check
    results['checks']['any_types'] = check_any_types(project_path)
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print("\n" + "="*50)
        print("TypeScript Conversion Verification Results")
        print("="*50)
        
        if 'typescript' in results['checks']:
            ts_result = results['checks']['typescript']
            status = "✓ PASS" if ts_result['success'] else "✗ FAIL"
            print(f"\nTypeScript Compilation: {status}")
            if not ts_result['success']:
                print(f"  Command: {ts_result['command']}")
                print(f"  Error: {ts_result['output'][:500]}")
        
        if 'tests' in results['checks']:
            test_result = results['checks']['tests']
            status = "✓ PASS" if test_result['success'] else "✗ FAIL"
            print(f"\nTest Suite: {status}")
            if not test_result['success']:
                print(f"  Command: {test_result['command']}")
                print(f"  Error: {test_result['output'][:500]}")
        
        import_issues = results['checks']['import_issues']
        print(f"\nImport Issues: {len(import_issues)} found")
        for issue in import_issues[:5]:  # Show first 5
            print(f"  - {issue['file']}: {issue['message']}")
        if len(import_issues) > 5:
            print(f"  ... and {len(import_issues) - 5} more")
        
        any_types = results['checks']['any_types']
        explicit_count = len(any_types.get('explicit', []))
        implicit_count = len(any_types.get('implicit', []))
        print(f"\n'any' Type Usages: {explicit_count + implicit_count} found")
        print(f"  - Explicit 'any': {explicit_count}")
        print(f"  - Implicit 'any' patterns: {implicit_count}")
        
        if explicit_count > 0:
            print("\n  Explicit 'any' examples (first 3):")
            for usage in any_types['explicit'][:3]:
                print(f"    - {usage['file']}:{usage['line']}")
        
        if implicit_count > 0:
            print("\n  Implicit 'any' examples (first 3):")
            for usage in any_types['implicit'][:3]:
                print(f"    - {usage['file']}:{usage['line']}")
        
        print("\n" + "="*50)
        
        # Overall status
        all_pass = True
        if 'typescript' in results['checks'] and not results['checks']['typescript']['success']:
            all_pass = False
        if 'tests' in results['checks'] and not results['checks']['tests']['success']:
            all_pass = False
        
        if all_pass:
            print("✓ All checks passed!")
        else:
            print("✗ Some checks failed. Review issues above.")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
