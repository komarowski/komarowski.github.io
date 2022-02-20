# Explorer.md

**Explorer.md** is a simple console application for generating html docs from markdown files and display those files in a tree structure. 


## Features

- Translates .md files to .html with a pure HTML layout (you can change `template.html` and add custom CSS or JS)
- Shows only markdown files in a file tree
- Shows table of contents (h1, h2 tags)

![](https://github.com/komarowski/Explorer-md/blob/main/images/screenshot.jpg)

## Getting Started

- Clone the repository
- Define a folder with markdown files and target folder in the `appsettings.json`
- Run the project in the given directory (you need [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) to build and run this application)

```csharp
> dotnet run
```

## Conventions

### Custom HTML

The default HTML is written in code and has basic inline styles. You can change `template.html` in the application root folder.

An example `assets/template.html` is provided in this repository. Copy also the `assets` to the folder with the HTML files.
