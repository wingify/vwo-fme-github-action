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
import { evaluate as runEvaluation } from './actions/EvaluateFlag';

/**
 * Main function to determine which action to run
 * @returns void
 */
const run = async (): Promise<void> => {
  try {
    /*
    const featureId = core.getInput('featureId');
    
    if (featureId) {
      // Run feature toggle
      await runToggle(featureId);
    }
    */

    // Get inputs
    const flagsWithVariables = core.getInput('flagsWithVariables', { required: true });

    // Run feature evaluation if flagsWithVariables is provided
    if (flagsWithVariables) {
      await runEvaluation(flagsWithVariables);
    }
  } catch (error) {
    core.setFailed(
      `Error occurred while running the action: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

run();
