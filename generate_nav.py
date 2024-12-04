import os
import yaml

def generate_nav(directory, base_path=""):
    nav = []
    for item in sorted(os.listdir(directory)):
        if item.startswith('.'):
            continue
        path = os.path.join(directory, item)
        if os.path.isdir(path):
            sub_nav = generate_nav(path, base_path + item + '/')
            if sub_nav:  # Only add directory if it has files
                nav.append({item: sub_nav})
        else:
            if item.endswith('.md'):
                nav.append({item.replace('.md', ''): base_path + item})
    return nav

docs_dir = '.'
nav = generate_nav(docs_dir)

if nav:  # Only add 'nav' to the configuration if it's not empty
    mkdocs_yaml = {
        'site_name': 'My Documentation Site',
        'docs_dir': '.',
        'plugins': [
            'search',
            'same-dir'
        ],
        'nav': nav
    }
    
    with open('mkdocs.yml', 'w') as f:
        yaml.dump(mkdocs_yaml, f, default_flow_style=False, sort_keys=False, indent=4)
    
    print("mkdocs.yml generated successfully.")
else:
    print("No valid documentation found; mkdocs.yml not created.")