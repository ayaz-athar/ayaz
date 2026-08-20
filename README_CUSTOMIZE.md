# Customizing Ayaz Athar’s Portfolio

The portfolio’s content lives in `client/src/pages/Home.tsx`. Its visual system is in `client/src/index.css`. The page has been written as a set of compact reusable React components and data lists so common updates can be made without duplicating content.

## Edit words, project details, and links

Open `client/src/pages/Home.tsx`. The top of the file contains four data lists: `navigation`, `projects`, `skillGroups`, and `journey`. Update those lists to change most of the visible content in one place.

| Change | Location | What to edit |
| --- | --- | --- |
| Hero headline and introduction | `Home` section with `hero-heading` | Main heading and summary paragraph |
| Project names, summaries, technologies, and links | `projects` list | `title`, `description`, `stack`, and `url` values |
| Technologies | `skillGroups` list | Each `values` string |
| Development timeline | `journey` list | Stage names only; avoid adding experience that is not accurate |
| Social destinations | `socialLinks` list | Public profile URLs and labels |
| Contact email | Search for `ayaz.athar.44@gmail.com` | The `mailto:` link and visible email text |

## Edit the restrained color system

Open `client/src/index.css`. Near the top, the color variables govern the full interface. Keep the palette limited and preserve contrast between the black surfaces and the primary text.

| Variable | Current value | Purpose |
| --- | --- | --- |
| `--black` | `#080808` | Main cinematic background |
| `--black-soft` | `#101010` | Secondary section surface |
| `--ink` | `#f5f5f5` | Primary text |
| `--muted` | `#8a8a8a` | Supporting text |
| `--line` | `#222222` | Structural rules and borders |
| `--moss` | `#93aa82` | Availability, focus, small metadata, and limited highlight accent |

> The interface is deliberately non-neon. If you change `--moss`, choose a muted color rather than a highly saturated one, and reserve it for signal details rather than repeated headline text.

## Change visual assets

Search for `manus-storage` in `client/src/pages/Home.tsx` to find the hero texture, three project images, and the square index mark. To substitute one, upload your new asset through the project file interface and replace the relevant `src="..."` URL. Keep image `alt` text meaningful wherever the image is content rather than decoration.

| Asset | Search term | Recommended shape |
| --- | --- | --- |
| Hero texture | `ayaz-hero-cinematic` | Landscape, 16:9, dark and text-safe |
| 3D Snake canvas | `ayaz-project-snake` | Landscape, 4:3 |
| Flappy Bird canvas | `ayaz-project-flappy` | Landscape, 4:3 |
| Slither.io canvas | `ayaz-project-slither` | Landscape, 4:3 |
| Browser mark | `favicon.svg` | Square technical double-bar index symbol |

## Preview and download

Use the project preview to verify navigation and mobile layout after an edit. You chose not to connect the website code to GitHub; its public GitHub links remain unchanged. The project can still be downloaded as a ZIP from the **More** menu. Saving a version preserves the code but does not publish the website.
