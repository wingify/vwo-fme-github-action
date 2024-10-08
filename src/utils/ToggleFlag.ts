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

import axios, { AxiosResponse } from 'axios';
import { Constants } from '../constants';
import * as core from '@actions/core';

interface ToggleResponse {
  _data: {
    [key: string]: {
      isEnabled: boolean;
    };
  };
}

/**
 * Validate inputs
 * @param accountId
 * @param featureId
 * @param toggleValue
 * @param sdkKey
 * @param token
 */
export const validateInputs = (
  accountId: string | undefined,
  featureId: string,
  toggleValue: string,
  sdkKey: string | undefined,
  token: string | undefined,
): void => {
  const missingInputs = [];
  if (!accountId) missingInputs.push('accountId');
  if (!toggleValue) missingInputs.push('toggleValue');
  if (!sdkKey) missingInputs.push('sdkKey');
  if (!token) missingInputs.push('token');

  if (missingInputs.length > 0) {
    throw new Error(`Missing required inputs: ${missingInputs.join(', ')}`);
  }

  if (isNaN(parseInt(toggleValue)) || ![0, 1].includes(parseInt(toggleValue))) {
    throw new Error(
      'Invalid toggleValue. Please provide 1 for enabling the feature flag or 0 for disabling the feature flag',
    );
  }
};

/**
 * Get inputs from the action
 * @returns {accountId, featureId, toggleValue, sdkKey, token}
 */
export const getInputs = (): {
  accountId: string | undefined;
  toggleValue: string;
  sdkKey: string | undefined;
  token: string | undefined;
} => {
  return {
    accountId: process.env.VWO_ACCOUNT_ID,
    toggleValue: core.getInput('toggleValue'),
    sdkKey: process.env.VWO_SDK_KEY,
    token: process.env.VWO_API_TOKEN,
  };
};

/**
 * Toggle feature flag
 * @param accountId
 * @param featureId
 * @param toggleValue Toggle value, use 1 for enable and 0 for disable
 * @param token VWO_API_TOKEN environment variable
 * @param sdkKey VWO_SDK_KEY environment variable
 * @returns
 */
export const flagToggle = async (
  accountId: string,
  featureId: string,
  toggleValue: number,
  token: string,
  sdkKey: string,
): Promise<boolean | null> => {
  try {
    const url = `${Constants.HTTPS_PROTOCOL}${Constants.VWO_APP_URL}/api/v2/accounts/${accountId}/environments/${sdkKey}/features/${featureId}/toggle`;

    // Set headers directly in the request
    const headers = {
      token: token,
    };

    const response: AxiosResponse<ToggleResponse> = await axios.patch(
      url,
      {
        isEnabled: toggleValue,
      },
      { headers }, // Pass headers in the request
    );

    if (response.data && response.data._data && response.data._data[featureId]) {
      return response.data._data[featureId].isEnabled;
    }
    return null;
  } catch (error) {
    core.setFailed(`Unable to toggle feature flag: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};
