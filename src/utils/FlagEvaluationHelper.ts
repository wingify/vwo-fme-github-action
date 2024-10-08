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
import { VWOClient } from './VWOClient';
import { IVWOOptions } from 'vwo-fme-node-sdk/dist/types/models/VWOOptionsModel';

export interface FeatureFlagDetails {
  [key: string]: string;
}

export interface Flags {
  [key: string]: FeatureFlagDetails;
}

/**
 * Get inputs from the GitHub action.
 *
 * @returns {Object} An object containing two fields:
 * - sdkInitOptionsInput: A string input representing VWO SDK initialization options.
 * - userContext: A string input representing the user context (required).
 */
export const getInputs = (): { sdkInitOptionsInput: string; userContext: string } => {
  return {
    sdkInitOptionsInput: core.getInput('sdkInitOptions'),
    userContext: core.getInput('userContext', { required: true }),
  };
};

/**
 * Validate required inputs for the action to ensure that all mandatory fields are present.
 * Throws an error if any required input is missing.
 *
 * @param {string | undefined} sdkKey - The SDK key for VWO.
 * @param {string | undefined} accountId - The account ID for VWO.
 * @param {Record<string, any>} parsedUserContext - Parsed user context, expected to have an 'id' field for the user.
 * @param {Flags} flags - Feature flags and variables to be evaluated.
 * @throws Will throw an error if any of the required inputs are missing.
 */
export const validateInputs = (
  sdkKey: string | undefined,
  accountId: string | undefined,
  parsedUserContext: Record<string, any>,
  flags: Flags,
): void => {
  const missingInputs = [];
  if (!sdkKey) missingInputs.push('sdkKey');
  if (!accountId) missingInputs.push('accountId');
  if (!parsedUserContext.id) missingInputs.push('userId');
  if (Object.keys(flags).length === 0) missingInputs.push('flagsWithVariables');

  if (missingInputs.length > 0) {
    throw new Error(`Missing required inputs: ${missingInputs.join(', ')}`);
  }
};

/**
 * Parse the flags input as a JSON string and convert it into a Flags object.
 * If the input is not a valid JSON string, an error is thrown.
 *
 * @param {string} flagsWithVariables - The JSON string representing flags and their variables.
 * @returns {Flags} Parsed flags object.
 * @throws Will throw an error if the flagsWithVariables is not a valid JSON string.
 */
export const parseFlags = (flagsWithVariables: string): Flags => {
  try {
    return JSON.parse(flagsWithVariables);
  } catch (error) {
    throw new Error(`Incorrect JSON format for flagsWithVariables: ${error}`);
  }
};

/**
 * Parse the SDK initialization options input from a JSON string and merge it with default options.
 * This function ensures that accountId and sdkKey are always included.
 *
 * @param {string} sdkInitOptionsInput - JSON string input containing additional SDK options.
 * @param {string} accountId - VWO account ID.
 * @param {string} sdkKey - VWO SDK key.
 * @returns {IVWOOptions} Parsed and merged VWO SDK options.
 * @throws Will throw an error if the sdkInitOptionsInput is not a valid JSON string.
 */
export const parseSDKInitOptions = (sdkInitOptionsInput: string, accountId: string, sdkKey: string): IVWOOptions => {
  let sdkInitOptions: IVWOOptions = { accountId, sdkKey };
  if (sdkInitOptionsInput) {
    try {
      sdkInitOptions = { ...sdkInitOptions, ...JSON.parse(sdkInitOptionsInput) };
    } catch (error) {
      throw new Error(`Incorrect JSON format for sdkInitOptions: ${error}`);
    }
  }
  return sdkInitOptions;
};

/**
 * Evaluate a feature flag using the VWO client for a specific user.
 * Sets the result of the flag evaluation as an output for GitHub Actions.
 *
 * @param {VWOClient} vwoClient - The VWO SDK client instance.
 * @param {string} flagKey - The key representing the feature flag to be evaluated.
 * @param {Record<string, any>} parsedUserContext - The parsed user context, containing the user identifier.
 * @returns {Promise<any>} The result of the flag evaluation.
 */
export const evaluateFlag = async (
  vwoClient: VWOClient,
  flagKey: string,
  parsedUserContext: Record<string, any>,
): Promise<any> => {
  const getFlag = await vwoClient.getFlagValue(flagKey, parsedUserContext);
  core.setOutput(`${flagKey}`, getFlag.isEnabled());
  return getFlag;
};

/**
 * Evaluate a variable attached to a specific feature flag.
 * If the variable is available, its value is set as an output for GitHub Actions.
 * Otherwise, the default value is used.
 *
 * @param {any} getFlag - The result of a flag evaluation, which includes variable data.
 * @param {string} flagKey - The key representing the feature flag.
 * @param {string} variableKey - The key of the variable attached to the flag.
 * @param {string} variableDefaultValue - Default value to use if the variable is not available.
 */
export const evaluateVariable = (
  getFlag: any,
  flagKey: string,
  variableKey: string,
  variableDefaultValue: string,
): void => {
  if (getFlag && typeof getFlag.getVariable === 'function') {
    const variableValue = getFlag.getVariable(variableKey, variableDefaultValue);
    core.setOutput(`${flagKey}_${variableKey}`, variableValue);
  } else {
    core.setOutput(`${flagKey}_${variableKey}`, variableDefaultValue);
  }
};
