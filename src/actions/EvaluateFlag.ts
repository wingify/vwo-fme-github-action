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
import { VWOClient } from '../utils/VWOClient';
import {
  getInputs,
  validateInputs,
  parseFlags,
  evaluateFlag,
  evaluateVariable,
  parseSDKInitOptions,
} from '../utils/FlagEvaluationHelper';

/**
 * Evaluate flags and set outputs
 * @returns {Promise<void>}
 */
export const evaluate = async (flagsWithVariables: string): Promise<void> => {
  try {
    // Get inputs from the action
    const { sdkInitOptionsInput, userContext } = getInputs();

    // Get SDK key and account ID from environment variables
    const sdkKey = process.env.VWO_SDK_KEY;
    const accountId = process.env.VWO_ACCOUNT_ID;

    // Parse user context from input
    let parsedUserContext;
    try {
      parsedUserContext = JSON.parse(userContext);
    } catch (error) {
      throw new Error(`Incorrect json format for userContext: ${error}`);
    }
    // Parse flags and SDK config
    const flags = parseFlags(flagsWithVariables);
    // Validate inputs
    validateInputs(sdkKey, accountId, parsedUserContext, flags);
    core.startGroup('Evaluating flags...');

    const sdkInitOptions = parseSDKInitOptions(sdkInitOptionsInput, accountId!, sdkKey!);

    // Initialize VWO client
    const vwoClient = new VWOClient(sdkInitOptions);

    // Evaluate flags and variables
    for (const [flagKey, flagDetails] of Object.entries(flags)) {
      const getFlag = await evaluateFlag(vwoClient, flagKey, parsedUserContext);

      for (const [varKey, varValue] of Object.entries(flagDetails)) {
        evaluateVariable(getFlag, flagKey, varKey, varValue);
      }
    }

    core.endGroup();
  } catch (error) {
    core.setFailed(`Error in Evaluate Flag action: ${error instanceof Error ? error.message : String(error)}`);
  }
};
