from PIL import Image
import os

img1_path = r"C:\Users\User\.gemini\antigravity\brain\319398bb-3820-489e-ae75-414431d7c6d7\media__1782400996365.png"
img2_path = r"C:\Users\User\.gemini\antigravity\brain\319398bb-3820-489e-ae75-414431d7c6d7\media__1782401119666.png"

for idx, path in enumerate([img1_path, img2_path], 1):
    if os.path.exists(path):
        try:
            with Image.open(path) as img:
                print(f"Image {idx}: {path}")
                print(f"  Format: {img.format}, Size: {img.size}, Mode: {img.mode}")
        except Exception as e:
            print(f"Error reading image {idx}: {e}")
    else:
        print(f"Path not found: {path}")
