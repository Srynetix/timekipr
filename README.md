# timekipr

A simple time-keeper app for meetings.

**:rocket: [Play with it here!](https://srynetix.github.io/timekipr/)**

## How to build

**Prerequisites:**

- [Node] 18+
- [Rust] (if building the desktop app)

### Build the webapp

```sh
npm install
npm run build:web
```

The webapp code will be in the `./apps/timekipr-web/dist` folder.
You can use `npm run serve:web` to run a simple server to access the app.

### Build the desktop app

The desktop app is made using [Tauri], so you will need [Rust].
Then run:

```sh
npm install
npm run build:desktop
```

The executable will be in the `./apps/timekipr-desktop/src-tauri/target/release` folder.

You will also generate installers for Windows:
- The installer MSI file will be in the folder `apps/timekipr-desktop/src-tauri/target/release/bundle/msi`
- The installer EXE file will be in the folder `apps/timekipr-desktop/src-tauri/target/release/bundle/nsis`

## TODO

- [ ] Add documentation

[Node]: https://nodejs.org/en
[Rust]: https://www.rust-lang.org/en
[Tauri]: https://tauri.app/
