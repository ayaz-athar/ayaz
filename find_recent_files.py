import os
import time

current_time = time.time()
search_dir = r"C:\Users\User\.gemini"

print("Searching for recently created images:")
for root, dirs, files in os.walk(search_dir):
    # Skip node_modules or large folders
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            filepath = os.path.join(root, file)
            try:
                mtime = os.path.getmtime(filepath)
                # Created/Modified in the last 20 minutes (1200 seconds)
                if current_time - mtime < 1200:
                    print(f"Found: {filepath} ({os.path.getsize(filepath)} bytes, modified {current_time - mtime:.1f}s ago)")
            except Exception:
                pass
