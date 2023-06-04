import os
import sys
import subprocess
from urllib.parse import unquote
from html import unescape

def modify_file(filename):
    subprocess.run([
        "python.exe",
        "modify_file.py",
        filename
    ])

def run_pandoc(html, md):
    open(html, 'w').close()
    subprocess.run([
        "pandoc",
        "--standalone",
        "--from",
        "markdown+yaml_metadata_block+implicit_figures+fenced_divs+citations+table_captions",
        "--to",
        "html5",
        "--webtex=https://latex.codecogs.com/png.latex?%5Cdpi{280}",
        "--output",
        html,
        md
    ])

# def run_pandoc(html, md):
    # open('html', 'w').close()
    # subprocess.run([
    #     "powershell.exe",
    #     "-ExecutionPolicy",
    #     "Bypass",
    #     "-File",
    #     "pandoc_script.ps1",
    #     html,
    #     md
    # ])


def run_md_publisher(html):
    subprocess.run([
        "md-publisher",
        "--log-level",
        "4",
        "publish",
        html
    ])

if __name__ == "__main__":
    try:
        filename = sys.argv[1]
    except:
        sys.exit("No filename")
    
    name = os.path.split(filename)[-1][:-3]
    filename_html = f"../_posts_medium/{name}.html"
    filename_md = f"../temp/{name}.md"

    open(filename_md, 'w').close()
    modify_file(filename)
    run_pandoc(filename_html, filename_md)
    run_md_publisher(filename_html)