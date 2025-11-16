# YouTube Metadata Extension

## Development environment

- Node 22
- pnpm 10
- Google Chrome 140

```shell
pnpm install --frozen-lockfile
```

## Build

```shell
pnpm run build
```

Add `dist/` directory to your browser as the unpackaged browser extension.

## Code format

```shell
pnpm run lint
pnpm run format
```

## Manage GitHub Action versions

We use [pinact](https://github.com/suzuki-shunsuke/pinact) to manage GitHub Action versions.

```shell
# Lock
pinact run

# Update
pinact run --update
```
