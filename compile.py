#!/usr/bin/env python3
"""
Compile the main.html template into a single self-contained HTML file.
Usage: python compile.py [input_html] [output_html] [build_dir]
Default: python compile.py main.html typewriter.html build
"""

import base64
import subprocess
import sys
from pathlib import Path

if __name__ == "__main__":
    input_file = "main.html"
    output_file = "typewriter.html"
    build_dir = "build"

    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    if len(sys.argv) > 3:
        build_dir = sys.argv[3]

    input_path = Path(input_file)
    build_path = Path(build_dir)

    if input_path.exists() is False:
        print(f"Error: {input_file} not found")
        sys.exit(1)

    build_path.mkdir(exist_ok=True)

    try:
        commit_sha = (
            subprocess.check_output(
                ["git", "rev-parse", "HEAD"], stderr=subprocess.DEVNULL
            )
            .decode()
            .strip()
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        commit_sha = "unknown"

    with open(input_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    html_content = html_content.replace(
        "{{version}}", f'<meta name="version" content="{commit_sha}">'
    )
    print(f"✓ Version {commit_sha[:8]}")

    favicon_path = input_path.parent / "icons" / "favicon.svg"
    if favicon_path.exists() is True:
        with open(favicon_path, "r", encoding="utf-8") as f:
            html_content = html_content.replace(
                "{{favicon}}",
                "data:image/svg+xml;base64,"
                + base64.b64encode(f.read().strip().encode("utf-8")).decode("utf-8"),
            )
        print("✓ Inlined favicon")

    css_files = sorted(input_path.parent.glob("styles/*.css"))
    if len(css_files) > 0:
        css_contents: list[str] = []
        for css_path in css_files:
            with open(css_path, "r", encoding="utf-8") as f:
                css_contents.append(f.read())
            print(f"✓ Bundled {css_path}")
        html_content = html_content.replace("{{styles}}", "\n".join(css_contents))

    external_files = sorted(input_path.parent.glob("external/*.js"))
    if len(external_files) > 0:
        external_contents: list[str] = []
        for ext_path in external_files:
            with open(ext_path, "r", encoding="utf-8") as f:
                external_contents.append(f.read())
            print(f"✓ Bundled {ext_path}")
        html_content = html_content.replace("{{external}}", "\n".join(external_contents))

    ordered_scripts: list[Path] = []
    main_entry = None
    for script in sorted(input_path.parent.glob("scripts/*.js")):
        if script.name == "main.js":
            main_entry = script
        else:
            ordered_scripts.append(script)
    if main_entry is not None:
        ordered_scripts.append(main_entry)
    if len(ordered_scripts) > 0:
        script_contents: list[str] = []
        for js_path in ordered_scripts:
            with open(js_path, "r", encoding="utf-8") as f:
                script_contents.append(f.read())
            print(f"✓ Bundled {js_path}")
        html_content = html_content.replace("{{scripts}}", "\n".join(script_contents))

    for template_path in sorted(input_path.parent.glob("templates/*.html")):
        marker = "{{template:" + str(template_path) + "}}"
        if marker in html_content:
            with open(template_path, "r", encoding="utf-8") as f:
                html_content = html_content.replace(marker, f.read().strip())
            print(f"✓ Inlined template {template_path}")

    for icon_path in sorted(input_path.parent.glob("icons/*.svg")):
        marker = "{{icon:" + str(icon_path) + "}}"
        if marker in html_content:
            with open(icon_path, "r", encoding="utf-8") as f:
                html_content = html_content.replace(marker, f.read().strip())
            print(f"✓ Inlined icon {icon_path}")

    with open(build_path / output_file, "w", encoding="utf-8") as f:
        _ = f.write(html_content)

    print(f"✓ Successfully compiled to {build_path / output_file}")
