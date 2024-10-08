# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-8

### Added

- First release of VWO Feature Management and Experimentation GitHub Action

```yaml
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
  sdkInitOptions: |
    {
      "logger": {
        "level": "DEBUG"
      }
    }
  userContext: |
    {
      "id": "your-user-id"
    }
env:
  VWO_SDK_KEY: ${{ secrets.VWO_SDK_KEY }}
  VWO_ACCOUNT_ID: ${{ secrets.VWO_ACCOUNT_ID }}
```
