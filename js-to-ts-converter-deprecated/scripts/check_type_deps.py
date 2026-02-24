#!/usr/bin/env python3
"""
Check which @types/* packages are needed for the project dependencies.
Analyzes package.json and suggests type definitions to install.
Supports npm, yarn, and pnpm package managers.
"""

import json
import sys
import argparse
from pathlib import Path
import subprocess
import os


def detect_package_manager(project_path):
    """
    Detect which package manager is being used in the project.
    Checks for lock files to determine the package manager.
    
    Returns:
        str: 'npm', 'yarn', or 'pnpm'
    """
    project_path = Path(project_path).resolve()
    
    if (project_path / 'pnpm-lock.yaml').exists():
        return 'pnpm'
    elif (project_path / 'yarn.lock').exists():
        return 'yarn'
    elif (project_path / 'package-lock.json').exists():
        return 'npm'
    else:
        # Default to npm if no lock file found
        return 'npm'


def get_install_command(package_manager, packages, dev=True):
    """
    Generate the install command for the detected package manager.
    
    Args:
        package_manager: 'npm', 'yarn', or 'pnpm'
        packages: List of package names to install
        dev: Whether to install as dev dependency
    
    Returns:
        str: The install command
    """
    packages_str = ' '.join(packages)
    
    if package_manager == 'yarn':
        if dev:
            return f"yarn add --dev {packages_str}"
        return f"yarn add {packages_str}"
    elif package_manager == 'pnpm':
        if dev:
            return f"pnpm add --save-dev {packages_str}"
        return f"pnpm add {packages_str}"
    else:  # npm
        if dev:
            return f"npm install --save-dev {packages_str}"
        return f"npm install {packages_str}"


# Common packages that need @types/* definitions
COMMON_TYPES_PACKAGES = {
    'express': '@types/express',
    'lodash': '@types/lodash',
    'node-fetch': '@types/node-fetch',
    'react': '@types/react',
    'react-dom': '@types/react-dom',
    'jest': '@types/jest',
    'mocha': '@types/mocha',
    'chai': '@types/chai',
    'webpack': '@types/webpack',
    'koa': '@types/koa',
    'passport': '@types/passport',
    'bcrypt': '@types/bcrypt',
    'jsonwebtoken': '@types/jsonwebtoken',
    'multer': '@types/multer',
    'cors': '@types/cors',
    'helmet': '@types/helmet',
    'compression': '@types/compression',
    'cookie-parser': '@types/cookie-parser',
    'uuid': '@types/uuid',
    'yargs': '@types/yargs',
    'inquirer': '@types/inquirer',
    'ws': '@types/ws',
    'socket.io': '@types/socket.io',
    'pg': '@types/pg',
    'mysql': '@types/mysql',
    'mongodb': '@types/mongodb',
    'redis': '@types/redis',
    'aws-sdk': '@types/aws-sdk',
    'axios': '@types/axios',
    'request': '@types/request',
    'supertest': '@types/supertest',
    'sinon': '@types/sinon',
    'faker': '@types/faker',
}


def get_installed_types(package_json_path):
    """Get list of already installed @types packages."""
    with open(package_json_path, 'r') as f:
        package_data = json.load(f)
    
    installed = set()
    all_deps = {}
    all_deps.update(package_data.get('dependencies', {}))
    all_deps.update(package_data.get('devDependencies', {}))
    
    for dep in all_deps:
        if dep.startswith('@types/'):
            installed.add(dep)
    
    return installed


def get_project_dependencies(package_json_path):
    """Get all project dependencies that might need types."""
    with open(package_json_path, 'r') as f:
        package_data = json.load(f)
    
    deps = set()
    deps.update(package_data.get('dependencies', {}).keys())
    deps.update(package_data.get('devDependencies', {}).keys())
    deps.update(package_data.get('peerDependencies', {}).keys())
    
    return deps


def check_types_needed(package_json_path, include_all=False):
    """
    Check which @types packages are needed.
    
    Args:
        package_json_path: Path to package.json
        include_all: If True, suggest types for all packages, not just common ones
    
    Returns:
        dict with 'needed', 'installed', and 'suggested' lists
    """
    installed = get_installed_types(package_json_path)
    deps = get_project_dependencies(package_json_path)
    
    needed = []
    
    if include_all:
        # Check all dependencies
        for dep in deps:
            if dep.startswith('@types/'):
                continue
            types_pkg = f"@types/{dep.replace('@', '').replace('/', '__')}"
            if types_pkg not in installed:
                needed.append((dep, types_pkg))
    else:
        # Check only common packages
        for dep in deps:
            if dep in COMMON_TYPES_PACKAGES:
                types_pkg = COMMON_TYPES_PACKAGES[dep]
                if types_pkg not in installed:
                    needed.append((dep, types_pkg))
    
    return {
        'needed': needed,
        'installed': sorted(installed),
        'dependencies': sorted(deps)
    }


def check_npm_registry(types_pkg):
    """Check if a types package exists on npm registry."""
    try:
        result = subprocess.run(
            ['npm', 'view', types_pkg, '--json'],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        # If npm is not available, assume it exists
        return True


def main():
    parser = argparse.ArgumentParser(
        description='Check which @types/* packages are needed for the project'
    )
    parser.add_argument(
        'package_json',
        nargs='?',
        default='package.json',
        help='Path to package.json (default: ./package.json)'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Check all dependencies, not just common ones'
    )
    parser.add_argument(
        '--json',
        action='store_true',
        help='Output results as JSON'
    )
    parser.add_argument(
        '--verify',
        action='store_true',
        help='Verify packages exist on npm (slower)'
    )
    parser.add_argument(
        '--install-command',
        action='store_true',
        help='Print install command for missing types'
    )
    parser.add_argument(
        '--package-manager',
        choices=['npm', 'yarn', 'pnpm', 'auto'],
        default='auto',
        help='Package manager to use (default: auto-detect)'
    )
    
    args = parser.parse_args()
    
    package_path = Path(args.package_json)
    if not package_path.exists():
        print(f"Error: {package_path} not found", file=sys.stderr)
        return 1
    
    # Detect package manager
    if args.package_manager == 'auto':
        package_manager = detect_package_manager(package_path.parent)
    else:
        package_manager = args.package_manager
    
    result: dict = check_types_needed(package_path, args.all)
    result['package_manager'] = package_manager
    
    if args.verify:
        verified_needed = []
        for dep, types_pkg in result['needed']:
            if check_npm_registry(types_pkg):
                verified_needed.append((dep, types_pkg))
        result['needed'] = verified_needed
    
    if args.json:
        # Convert tuples to dict for JSON serialization
        result['needed'] = [{'package': dep, 'types': types} for dep, types in result['needed']]
        print(json.dumps(result, indent=2))
    elif args.install_command:
        if result['needed']:
            packages = [types for _, types in result['needed']]
            cmd = get_install_command(package_manager, packages, dev=True)
            print(cmd)
        else:
            print(f"# All type definitions are already installed ({package_manager})")
    else:
        print(f"\n=== Type Definitions Check ===")
        print(f"Package Manager: {package_manager}\n")
        
        print(f"Already installed ({len(result['installed'])}):")
        if result['installed']:
            for pkg in result['installed']:
                print(f"  ✓ {pkg}")
        else:
            print("  (none)")
        
        print(f"\nNeeded ({len(result['needed'])}):")
        if result['needed']:
            for dep, types_pkg in result['needed']:
                print(f"  ✗ {dep} → {types_pkg}")
        else:
            print("  (none - all caught up!)")
        
        if result['needed']:
            packages = [types for _, types in result['needed']]
            cmd = get_install_command(package_manager, packages, dev=True)
            print(f"\nInstall command:")
            print(f"  {cmd}")
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
