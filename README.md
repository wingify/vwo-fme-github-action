# VWO FME GitHub Action

This GitHub Action allows you to evaluate feature flags using the VWO platform. Evaluating feature flags can be useful in CI/CD pipelines to dynamically enable/disable features or retrieve feature flag values during builds. Feature flag variables enable dynamic assignment of values based on the flag's configuration, helping to eliminate hardcoded values from the codebase.

## Inputs

| **Input Name**       | **Description**                                                   | **Required** |
| -------------------- | ----------------------------------------------------------------- | ------------ |
| `flagsWithVariables` | A JSON with the feature flag keys and their default values.       | Yes          |
| `userContext`        | The context of the user for which the flag needs to be evaluated. | Yes          |
| `sdkInitOptions`     | Optional JSON configuration for initializing the VWO SDK.         | No           |

## Outputs

| **Output Name**       | **Description**                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `flagKey`             | The status of the feature flag (true or false). Example: `${{ steps.vwo_action.outputs.flagKey }}`.                        |
| `flagKey_variableKey` | The value of the associated variable for the feature flag. Example: `${{ steps.vwo_action.outputs.flagKey_variableKey }}`. |

> **Note:** `flagKey` and `flagKey_variableKey` are dynamic placeholders. The actual key names will be replaced based on the feature flags you are working with. For example, if the feature flag is `featureA`, you would access its status as `${{ steps.vwo_action.outputs.featureA }}` and a variable within that flag as `${{ steps.vwo_action.outputs.featureA_someVariableKey }}`.

## Environment Variables

| **Environment Variable** | **Description**                             | **Required** |
| ------------------------ | ------------------------------------------- | ------------ |
| `VWO_SDK_KEY`            | The SDK key used to initialize the VWO SDK. | Yes          |
| `VWO_ACCOUNT_ID`         | The account ID of the VWO project.          | Yes          |

## Usage Example

```yaml
name: Feature Flag Management

on:
  push:
    branches:
      - main

jobs:
  feature-flag-evaluation:
    runs-on: ubuntu-latest
    steps:
      - name: Evaluate Feature Flags
        uses: wingify/vwo-fme-github-action@v1.1.0
        with:
          flagsWithVariables: |
            {
              "feature-flag-key-1": {
                "variable-key-1": "variable-default-value"
              },
              "feature-flag-key-2": {
                "variable-key-1": "variable-default-value"
              }
            }
          userContext: |
            {
              "id": "your-user-id"
            }
          sdkInitOptions: |
            {
              "logger": {
                "level": "DEBUG"
              }
            }
        env:
          VWO_SDK_KEY: ${{ secrets.VWO_SDK_KEY }}
          VWO_ACCOUNT_ID: ${{ secrets.VWO_ACCOUNT_ID }}
```

### Authors

- [Abhishek Joshi](https://github.com/Abhi591)

### Changelog

Refer [CHANGELOG.md](https://github.com/wingify/vwo-fme-github-action/blob/master/CHANGELOG.md)

### Contributing

Please go through our [contributing guidelines](https://github.com/wingify/vwo-fme-github-action/blob/master/CONTRIBUTING.md)

### Code of Conduct

[Code of Conduct](https://github.com/wingify/vwo-fme-github-action/blob/master/CODE_OF_CONDUCT.md)

### License

[Apache License, Version 2.0](https://github.com/wingify/vwo-fme-github-action/blob/master/LICENSE)

Copyright 2024 Wingify Software Pvt. Ltd.
