"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateVariable = exports.evaluateFlag = exports.parseSDKInitOptions = exports.parseFlags = exports.validateInputs = exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
/**
 * Get inputs from the GitHub action.
 *
 * @returns {Object} An object containing two fields:
 * - sdkInitOptionsInput: A string input representing VWO SDK initialization options.
 * - userContext: A string input representing the user context (required).
 */
const getInputs = () => {
    return {
        sdkInitOptionsInput: core.getInput('sdkInitOptions'),
        userContext: core.getInput('userContext', { required: true }),
    };
};
exports.getInputs = getInputs;
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
const validateInputs = (sdkKey, accountId, parsedUserContext, flags) => {
    const missingInputs = [];
    if (!sdkKey)
        missingInputs.push('sdkKey');
    if (!accountId)
        missingInputs.push('accountId');
    if (!parsedUserContext.id)
        missingInputs.push('userId');
    if (Object.keys(flags).length === 0)
        missingInputs.push('flagsWithVariables');
    if (missingInputs.length > 0) {
        throw new Error(`Missing required inputs: ${missingInputs.join(', ')}`);
    }
};
exports.validateInputs = validateInputs;
/**
 * Parse the flags input as a JSON string and convert it into a Flags object.
 * If the input is not a valid JSON string, an error is thrown.
 *
 * @param {string} flagsWithVariables - The JSON string representing flags and their variables.
 * @returns {Flags} Parsed flags object.
 * @throws Will throw an error if the flagsWithVariables is not a valid JSON string.
 */
const parseFlags = (flagsWithVariables) => {
    try {
        return JSON.parse(flagsWithVariables);
    }
    catch (error) {
        throw new Error(`Incorrect JSON format for flagsWithVariables: ${error}`);
    }
};
exports.parseFlags = parseFlags;
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
const parseSDKInitOptions = (sdkInitOptionsInput, accountId, sdkKey) => {
    let sdkInitOptions = { accountId, sdkKey };
    if (sdkInitOptionsInput) {
        try {
            sdkInitOptions = Object.assign(Object.assign({}, sdkInitOptions), JSON.parse(sdkInitOptionsInput));
        }
        catch (error) {
            throw new Error(`Incorrect JSON format for sdkInitOptions: ${error}`);
        }
    }
    return sdkInitOptions;
};
exports.parseSDKInitOptions = parseSDKInitOptions;
/**
 * Evaluate a feature flag using the VWO client for a specific user.
 * Sets the result of the flag evaluation as an output for GitHub Actions.
 *
 * @param {VWOClient} vwoClient - The VWO SDK client instance.
 * @param {string} flagKey - The key representing the feature flag to be evaluated.
 * @param {Record<string, any>} parsedUserContext - The parsed user context, containing the user identifier.
 * @returns {Promise<any>} The result of the flag evaluation.
 */
const evaluateFlag = (vwoClient, flagKey, parsedUserContext) => __awaiter(void 0, void 0, void 0, function* () {
    const getFlag = yield vwoClient.getFlagValue(flagKey, parsedUserContext);
    core.setOutput(`${flagKey}`, getFlag.isEnabled());
    return getFlag;
});
exports.evaluateFlag = evaluateFlag;
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
const evaluateVariable = (getFlag, flagKey, variableKey, variableDefaultValue) => {
    if (getFlag && typeof getFlag.getVariable === 'function') {
        const variableValue = getFlag.getVariable(variableKey, variableDefaultValue);
        core.setOutput(`${flagKey}_${variableKey}`, variableValue);
    }
    else {
        core.setOutput(`${flagKey}_${variableKey}`, variableDefaultValue);
    }
};
exports.evaluateVariable = evaluateVariable;
