# two-net

![main](https://github.com/two-net/two-net/actions/workflows/main.yml/badge.svg)

Personal portfolio and resume site for **Nattapong Kaewseeiam (Two)** — Senior Software / Full-stack Developer, Bangkok, Thailand.

The site is a single-page static front end (plain HTML/CSS/JS, no framework) served by a minimal ASP.NET Core host, packaged as a Docker image and published to GitHub Container Registry.

## Tech stack

- **.NET 10** / ASP.NET Core (`Microsoft.NET.Sdk.Web`) — serves the static site and exposes OpenAPI in development
- **Vanilla HTML/CSS/JS** — no frontend framework or build step
- **Docker** — runtime-only image based on `mcr.microsoft.com/dotnet/aspnet:10.0`
- **GitHub Actions** — builds and pushes the image to `ghcr.io` on tag push

## Project structure

```
├── Dockerfile                  # Runtime image; copies pre-published output
├── .github/workflows/main.yml  # Tag-triggered build & ghcr.io publish
└── src/Two.Net/
    ├── Program.cs              # Minimal ASP.NET Core host (static files + controllers)
    ├── Two.Net.csproj
    └── wwwroot/
        ├── index.html          # The entire site: profile, skills, experience, portfolio
        ├── css/style.css
        ├── js/main.js          # Theme toggle, typewriter, filters, scroll effects
        └── assets/             # Downloadable resume (PDF)
```

## Site features

- Light/dark theme toggle (follows `prefers-color-scheme` by default)
- Typewriter headline, animated stat counters, scroll-reveal sections
- Skill search and category tabs
- Expandable experience entries with auto-updating durations
- Portfolio grid with technology filters
- Scroll progress bar, back-to-top button, `prefers-reduced-motion` support

## Run locally

Requires the [.NET 10 SDK](https://dotnet.microsoft.com/download).

```sh
dotnet run --project src/Two.Net
```

Then open <http://localhost:5145> (or <https://localhost:7089> with the `https` profile).

## Docker

The Dockerfile expects the app to be published first — it copies `./published` into a runtime-only image:

```sh
dotnet publish src/Two.Net/Two.Net.csproj -c Release -o published
docker build -t two-net .
docker run --rm -p 8080:8080 two-net
```

## CI/CD

Pushing a git tag triggers the [`main` workflow](.github/workflows/main.yml), which:

1. Restores, builds, and publishes the .NET project
2. Builds the Docker image from the published output
3. Pushes it to `ghcr.io/two-net/two-net`, tagged from the git tag
