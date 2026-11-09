### Loopers 0.1.0
#### Added

- Components: Add simple theme and adjust background and text color
- Env: Add vapid keys variable
- Notification: Implement notification if user haven't push on day
- Page: Add reset function to reset ball count
- Push: Add automatically subscribe after opening the page
- ServiceWorker: Add serviceWorker file and their assets

#### Fixed

- Push: Add push validation so that pushes can only be made if the server allows it
- Validation: Mark claimed only if updatedAt is not yesterday

#### Refactor

- Button: Remove active scale and transition in button component
- Component: Change rounded medium to xl in button component
- Layout: Remove force fullscreen on both devices
- Notification: Tidy up notification modules
- Text: Set the default font weight to 500 and fix color
- Text: Change color to 500
- Theme: Separate zenlesszonezero design theme to components folder

#### Misc

- Adapter: Replace adapter-cloudflare to adapter-vercel
- Build: Replace sveltekit adapter auto to adapter-cloudflare
- Pnpm: Remove workspace file
- Release: Add git-cliff configuration file

