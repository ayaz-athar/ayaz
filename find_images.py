import os
import glob

# Search in workspace, parent folder, and appDataDir
search_paths = [
    r"C:\Users\User\.gemini\antigravity\scratch\ayaz-portfolio\*",
    r"C:\Users\User\.gemini\antigravity\brain\319398bb-3820-489e-ae75-414431d7c6d7\*",
    r"C:\Users\User\.gemini\antigravity\*"
]

print("Searching for images:")
for path in search_paths:
    for ext in ['*.png', '*.jpg', '*.jpeg', '*.svg', '*.gif']:
        found = glob.glob(os.path.join(path, ext))
        if found:
            print(f"Path {path} ({ext}):")
            for f in found:
                print(f"  - {f} ({os.path.getsize(f)} bytes)")
