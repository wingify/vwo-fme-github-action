/**
 * Copyright 2024 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from '@actions/core';
import { flagToggle } from '../utils/ToggleFlag';
import { getInputs, validateInputs } from '../utils/ToggleFlag';

export const featureFlagToggle = async (featureId: string): Promise<void> => {
  try {
    const { accountId, toggleValue, sdkKey, token } = getInputs();
    validateInputs(accountId, featureId, toggleValue, sdkKey, token);

    core.startGroup('Toggle feature flag');
    const featureFlagIsEnabled = await flagToggle(accountId!, featureId, parseInt(toggleValue), token!, sdkKey!);

    if (featureFlagIsEnabled === null) {
      throw new Error(`Failed to toggle feature flag ${featureId}`);
    }

    core.info(`Feature flag ${featureId} is ${featureFlagIsEnabled ? 'enabled' : 'disabled'}`);
    core.endGroup();

    core.setOutput('featureFlagStatus', featureFlagIsEnabled);
  } catch (error) {
    core.setFailed(`Error in Toggle Feature Status action: ${error instanceof Error ? error.message : String(error)}`);
  }
};
