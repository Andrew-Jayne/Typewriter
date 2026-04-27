#!/usr/bin/env python3
"""
Compile separate HTML, CSS, and JS files into a single HTML file.
Usage: python compile.py [input_html] [output_html] [build_dir]
Default: python compile.py TypeWriter-dev.html TypeWriter.html build
"""

import sys
import os
import re
from pathlib import Path


def compile_html(input_file, output_file, build_dir='build'):
    """Read HTML file and inline all CSS and JS files."""
    input_path = Path(input_file)
    build_path = Path(build_dir)

    if not input_path.exists():
        print(f"Error: {input_file} not found")
        return False

    # Create build directory if it doesn't exist
    build_path.mkdir(exist_ok=True)

    # Read the HTML file
    with open(input_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Find and replace CSS links
    css_pattern = r'<link\s+rel="stylesheet"\s+href="([^"]+)">'

    def replace_css(match):
        css_file = match.group(1)
        css_path = input_path.parent / css_file

        if not css_path.exists():
            print(f"Warning: CSS file {css_file} not found, skipping")
            return match.group(0)

        with open(css_path, 'r', encoding='utf-8') as f:
            css_content = f.read()

        print(f"✓ Inlined {css_file}")
        return f"<style>\n{css_content}\n</style>"

    html_content = re.sub(css_pattern, replace_css, html_content)

    # Find and replace JS scripts
    js_pattern = r'<script\s+src="([^"]+)"></script>'

    def replace_js(match):
        js_file = match.group(1)
        js_path = input_path.parent / js_file

        if not js_path.exists():
            print(f"Warning: JS file {js_file} not found, skipping")
            return match.group(0)

        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()

        print(f"✓ Inlined {js_file}")
        return f"<script>\n{js_content}\n</script>"

    html_content = re.sub(js_pattern, replace_js, html_content)

    # Write the compiled HTML to build directory
    output_path = build_path / output_file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✓ Successfully compiled to {output_path}")
    return True


if __name__ == '__main__':
    input_html = sys.argv[1] if len(sys.argv) > 1 else 'TypeWriter-dev.html'
    output_html = sys.argv[2] if len(sys.argv) > 2 else 'TypeWriter.html'
    build_dir = sys.argv[3] if len(sys.argv) > 3 else 'build'

    success = compile_html(input_html, output_html, build_dir)
    sys.exit(0 if success else 1)
