import shutil
import os

src_img = r"C:\Users\User\.gemini\antigravity\brain\319398bb-3820-489e-ae75-414431d7c6d7\media__1782401119666.png"
dest_png = r"C:\Users\User\.gemini\antigravity\scratch\ayaz-portfolio\public\favicon.png"
dest_svg = r"C:\Users\User\.gemini\antigravity\scratch\ayaz-portfolio\public\favicon.svg"

# Copy PNG logo to public directory
if os.path.exists(src_img):
    shutil.copy(src_img, dest_png)
    print(f"Copied {src_img} to {dest_png}")
else:
    print(f"Source image not found: {src_img}")

# Remove old SVG favicon if exists
if os.path.exists(dest_svg):
    os.remove(dest_svg)
    print(f"Removed old SVG favicon: {dest_svg}")
