#!/usr/bin/env python3
"""
Find JavaScript files that need to be converted to TypeScript.
Excludes node_modules, build directories, and already-converted .ts files.
"""

import os
import sys
import argparse
from pathlib import Path


def should_exclude_file(file_path):
    """
    Check if a file should be excluded from conversion.
    
    Args:
        file_path: Path object of the file
    
    Returns:
        bool: True if file should be excluded
    """
    file_name = file_path.name.lower()
    
    # Exclude Vite config files
    vite_configs = [
        'vite.config.js',
        'vite.config.ts',
        'vite.config.mjs',
        'vite.config.cjs',
        'vitest.config.js',
        'vitest.config.ts',
    ]
    
    if file_name in vite_configs:
        return True
    
    return False


def find_js_files(project_path, exclude_patterns=None):
    """
    Find all .js and .jsx files in the project that don't have corresponding .ts files.
    Excludes Vite config files and other files that should not be converted.
    
    Args:
        project_path: Root path of the project
        exclude_patterns: List of directory names to exclude (e.g., ['node_modules', 'dist'])
    
    Returns:
        List of Path objects for JavaScript files that need conversion
    """
    if exclude_patterns is None:
        exclude_patterns = ['node_modules', 'dist', 'build', '.git', 'coverage', '.next']
    
    js_files = []
    project_path = Path(project_path).resolve()
    
    for root, dirs, files in os.walk(project_path):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_patterns and not d.startswith('.')]
        
        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = Path(root) / file
                
                # Skip excluded files (Vite configs, etc.)
                if should_exclude_file(file_path):
                    continue
                
                # Check if corresponding .ts or .tsx already exists
                ts_path = file_path.with_suffix('.ts')
                tsx_path = file_path.with_suffix('.tsx')
                
                if not ts_path.exists() and not tsx_path.exists():
                    js_files.append(file_path)
    
    return sorted(js_files)


def categorize_files(js_files, project_path):
    """
    Categorize JavaScript files by type for prioritization.
    
    Returns dict with categories:
    - src: Source files (src/, lib/, etc.)
    - tests: Test files
    - config: Configuration files
    - scripts: Build/utility scripts
    - other: Uncategorized
    """
    categories = {
        'src': [],
        'tests': [],
        'config': [],
        'scripts': [],
        'other': []
    }
    
    test_patterns = ['test', 'spec', '__tests__', '__mocks__']
    config_patterns = ['config', '.config', 'webpack', 'rollup', 'vite', 'eslint', 'prettier', 'babel', 'jest']
    script_patterns = ['scripts', 'bin', 'tools']
    src_patterns = ['src', 'lib', 'app', 'pages', 'components', 'utils', 'helpers']
    
    for file_path in js_files:
        path_str = str(file_path).lower()
        file_name = file_path.name.lower()
        
        # Check for test files
        if any(pattern in path_str for pattern in test_patterns):
            categories['tests'].append(file_path)
        # Check for config files
        elif any(pattern in file_name for pattern in config_patterns):
            categories['config'].append(file_path)
        # Check for scripts
        elif any(pattern in path_str for pattern in script_patterns):
            categories['scripts'].append(file_path)
        # Check for source files
        elif any(pattern in path_str for pattern in src_patterns):
            categories['src'].append(file_path)
        else:
            categories['other'].append(file_path)
    
    return categories


def detect_jsx_usage(file_path):
    """
    Detect if a .js file contains JSX syntax.
    
    Returns:
        bool: True if JSX syntax is detected
    """
    try:
        content = file_path.read_text(encoding='utf-8', errors='ignore')
        # Simple heuristics for JSX detection
        jsx_patterns = [
            '<[A-Z][a-zA-Z]*',  # Component tags like <Component />
            '<[a-z]+ [^>]*>',   # HTML-like tags with attributes
            'React\.createElement',
            'import.*React.*from',
            'from.*react',
        ]
        import re
        for pattern in jsx_patterns:
            if re.search(pattern, content):
                return True
        return False
    except Exception:
        return False


def get_conversion_target(file_path):
    """
    Determine the recommended TypeScript extension for a file.
    
    Returns:
        str: '.ts' or '.tsx'
    """
    if file_path.suffix == '.jsx':
        return '.tsx'
    elif file_path.suffix == '.js':
        if detect_jsx_usage(file_path):
            return '.tsx'
        return '.ts'
    return '.ts'


def main():
    parser = argparse.ArgumentParser(
        description='Find JavaScript files that need TypeScript conversion'
    )
    parser.add_argument(
        'project_path',
        nargs='?',
        default='.',
        help='Path to the project root (default: current directory)'
    )
    parser.add_argument(
        '--exclude',
        nargs='+',
        default=['node_modules', 'dist', 'build', '.git', 'coverage'],
        help='Directories to exclude from search'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output results as JSON'
    )
    parser.add_argument(
        '--categorize',
        action='store_true',
        help='Categorize files by type'
    )
    parser.add_argument(
        '--with-target',
        action='store_true',
        help='Show recommended conversion target (.ts or .tsx)'
    )
    
    args = parser.parse_args()
    
    js_files = find_js_files(args.project_path, args.exclude)
    
    if args.json:
        import json
        if args.categorize:
            categories = categorize_files(js_files, args.project_path)
            result = {
                category: [str(f) for f in files]
                for category, files in categories.items()
            }
            print(json.dumps(result, indent=2))
        elif args.with_target:
            result = []
            for f in js_files:
                target = get_conversion_target(f)
                result.append({
                    'file': str(f),
                    'current_ext': f.suffix,
                    'target_ext': target
                })
            print(json.dumps(result, indent=2))
        else:
            print(json.dumps([str(f) for f in js_files], indent=2))
    else:
        if args.categorize:
            categories = categorize_files(js_files, args.project_path)
            for category, files in categories.items():
                if files:
                    print(f"\n=== {category.upper()} ({len(files)} files) ===")
                    for f in files:
                        print(f"  {f}")
        elif args.with_target:
            print(f"\nFound {len(js_files)} JavaScript files to convert:\n")
            for f in js_files:
                target = get_conversion_target(f)
                print(f"  {f} → {target}")
        else:
            print(f"\nFound {len(js_files)} JavaScript files to convert:\n")
            for f in js_files:
                print(f"  {f}")
    
    return 0 if js_files else 1


if __name__ == '__main__':
    sys.exit(main())
