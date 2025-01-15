## Development environment

### Useful commands

#### Run dev-env (no live packages)

```sh
turbo dev --filter=@iot-app-kit/dev-env
```

#### Run dev-env + live dashboard

```sh
turbo dev --filter=@iot-app-kit/dev-env --filter=@iot-app-kit/dashboard
```

#### Run dev-env + multiple live packages

```sh
turbo dev --filter=@iot-app-kit/dev-env --filter=@iot-app-kit/dashboard --filter=@iot-app-kit/react-components
```

#### Run react-components dev env (to be removed in favor of @iot-app-kit/dev-env)

```sh
turbo dev:react-components --filter=@iot-app-kit/react-components
```

#### Run react-components dev env + live packages (to be removed in favor of @iot-app-kit/dev-env)

```sh
turbo dev:react-components --filter=@iot-app-kit/react-components --filter=@iot-app-kit/source-iotsitewise
```
