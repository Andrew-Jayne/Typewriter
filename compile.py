#!/usr/bin/env python3
"""
Compile separate HTML, CSS, and JS files into a single HTML file.
Usage: python compile.py [input_html] [output_html] [build_dir]
Default: python compile.py main.html typewriter.html build
"""

import sys
import re
import subprocess
from pathlib import Path


if __name__ == '__main__':
    input_file = 'main.html'
    output_file = 'typewriter.html'
    build_dir = 'build'

    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    if len(sys.argv) > 3:
        build_dir = sys.argv[3]

    input_path = Path(input_file)
    build_path = Path(build_dir)

    if input_path.exists() is False:
        print(f'Error: {input_file} not found')
        sys.exit(1)

    build_path.mkdir(exist_ok=True)

    try:
        commit_sha = subprocess.check_output(
            ['git', 'rev-parse', 'HEAD'],
            stderr=subprocess.DEVNULL
        ).decode().strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        commit_sha = 'unknown'

    with open(input_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    html_content = html_content.replace(
        '<meta charset="UTF-8">',
        f'<meta charset="UTF-8">\n    <meta name="version" content="{commit_sha}">'
    )

    css_match = re.search(r'<link\s+rel="stylesheet"\s+href="([^"]+)">', html_content)
    while css_match is not None:
        css_path = input_path.parent / css_match.group(1)
        if css_path.exists() is True:
            with open(css_path, 'r', encoding='utf-8') as f:
                html_content = html_content[:css_match.start()] + f'<style>\n{f.read()}\n</style>' + html_content[css_match.end():]
            print(f'✓ Inlined {css_match.group(1)}')
        else:
            print(f'Warning: CSS file {css_match.group(1)} not found, skipping')
            html_content = html_content[:css_match.start()] + html_content[css_match.end():]
        css_match = re.search(r'<link\s+rel="stylesheet"\s+href="([^"]+)">', html_content)

    js_match = re.search(r'<script\s+src="([^"]+)"></script>', html_content)
    while js_match is not None:
        js_path = input_path.parent / js_match.group(1)
        if js_path.exists() is True:
            with open(js_path, 'r', encoding='utf-8') as f:
                html_content = html_content[:js_match.start()] + f'<script>\n{f.read()}\n</script>' + html_content[js_match.end():]
            print(f'✓ Inlined {js_match.group(1)}')
        else:
            print(f'Warning: JS file {js_match.group(1)} not found, skipping')
            html_content = html_content[:js_match.start()] + html_content[js_match.end():]
        js_match = re.search(r'<script\s+src="([^"]+)"></script>', html_content)

    icon_match = re.search(r'\{\{icon:([^}]+)\}\}', html_content)
    while icon_match is not None:
        icon_path = input_path.parent / icon_match.group(1)
        if icon_path.exists() is True:
            with open(icon_path, 'r', encoding='utf-8') as f:
                svg_content = f.read().strip()
            html_content = html_content[:icon_match.start()] + svg_content + html_content[icon_match.end():]
            print(f'✓ Inlined icon {icon_match.group(1)}')
        else:
            print(f'Warning: Icon {icon_match.group(1)} not found, skipping')
            html_content = html_content[:icon_match.start()] + html_content[icon_match.end():]
        icon_match = re.search(r'\{\{icon:([^}]+)\}\}', html_content)

    with open(build_path / output_file, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f'✓ Successfully compiled to {build_path / output_file}')
