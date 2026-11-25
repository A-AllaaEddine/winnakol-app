# Winakol

![Winakol application icon](https://raw.githubusercontent.com/A-AllaaEddine/winnakol-app/main/assets/images/icon.png)

Winakol is a React Native and Expo mobile application for discovering restaurants and dishes. The public source shows flows for browsing and filtering restaurants, viewing shop and dish details, favorites, ratings, account access, and shop or dish management actions.

> **Source limitation:** this repository does not include a companion backend source. `trpc/client.ts` imports an `AppRouter` type from a sibling backend directory, and the app sends API requests to a separately configured `/api/trpc` service. A clean checkout is therefore not a self-contained, end-to-end build until the matching backend source or router type is available.

## Functionality visible in the source

- Restaurant search and category filtering.
- Shop and dish detail screens, image galleries, ratings, and report actions.
- Favorite shops and dishes for signed-in users.
- Sign-in, registration, and password reset screens using FullAuth React Native.
- Shop profile, hours, phone, location, and dish management screens.
- English, French, and Arabic localization, plus light and dark appearance preferences.

These are source-code observations; a working backend and configured service endpoints are required for live data and account flows.

## Technology and architecture

- Expo SDK 51, React Native 0.74, TypeScript, and Expo Router.
- tRPC with TanStack Query for API calls.
- FullAuth React Native for session and account flows.
- `app/` contains Expo Router screens; `components/` contains feature UI; `context/` and `locales/` hold app preferences and translations; `trpc/` contains the API client/provider.

## Local development

Install dependencies and start Expo after providing a compatible backend:

```bash
npm install
npm start
```

For platform targets, use `npm run android` or `npm run ios` with the corresponding emulator/device toolchain installed. Expo's development server also supports the web target through `npm run web`. See the [Expo development documentation](https://docs.expo.dev/get-started/start-developing/) for device and emulator setup.

Configure the public API base URL in `EXPO_PUBLIC_BASE_URL` and the FullAuth service base URL in `EXPO_PUBLIC_FULLAUTH_URL` for the environment you control. Variables prefixed with `EXPO_PUBLIC_` are included in the client bundle; do not put passwords, private keys, or other secrets in them. The authentication layer is [FullAuth React Native](https://github.com/A-AllaaEddine/fullauth). The backend source and a complete local environment are not included here, so the commands above describe the app workflow rather than a verified standalone build.

## Android bundle note

The repository currently tracks `winakol_v1.0.aab` (about 38 MB). An AAB is an Android distribution bundle rather than a standalone APK, and this repository does not link an available Google Play listing. For future versioned distribution, GitHub Releases would keep generated bundles separate from source; this README change leaves the existing file and history untouched.

## Existing limitations

- The companion API/backend implementation is absent from this repository, and the tRPC client imports a router type from a sibling backend source that is not included here.
- Account, shop, and dish data flows depend on the separately hosted backend.
- No available Google Play listing is claimed.
- The tracked Android App Bundle has not been independently rebuilt from this checkout.
