# Clear Morning
Chrome/Edge "New Tab" page.

![Screen Shot 2564-08-28 at 13 51 57](https://user-images.githubusercontent.com/35027979/131209709-94f148a3-1378-4c0b-9e29-490d8061f2c6.png)

Feature:
- Google suggestion
- Customizable short cut
- Video background

## Prerequisted
- Chromium Browser
- [New Tab Changer Extension](https://chrome.google.com/webstore/detail/new-tab-changer/occbjkhimchkolibngmcefpjlbknggfh?hl=en)

## Setup
1. Clone the repo

2. Go to new tab changer, point to local repo -> index.html

## Search bar
When opening a new tab, the browser search bar will be focused (not the in-page search).

To use the page search bar, press `TAB` or reload the page once.

By default, the search bar is using Google search but if prefix with certain command, it will redirect to other search engine.

To use a command, type the command name with space and the search query.

For example:
```
yt blue archive // Search "blue archive" in youtube
```

This will redirect to youtube search with query "blue archive".

### Available Command
- `yt` - Youtube
- `gh` - Go directly to github link
- `ask` - Perplexity search
- `gpt` - Create a new conversation with ChatGPT
- `cl` - Create a new conversation with Claude
- `<number>` (which in range of pinned tab) - Go to pinned tab

## Shortcut
Same with command but without space.

Shortcut will go directly to the link.

For example:
```
:8000 // Go to http://localhost:8000
```

### Available Shortcut
- `:` - http://localhost:<query>
- `//` - https://<query>

## Customization
It's a single html file dude, just do whatever you want.
