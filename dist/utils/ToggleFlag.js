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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagToggle = exports.getInputs = exports.validateInputs = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const core = __importStar(require("@actions/core"));
/**
 * Validate inputs
 * @param accountId
 * @param featureId
 * @param toggleValue
 * @param sdkKey
 * @param token
 */
const validateInputs = (accountId, featureId, toggleValue, sdkKey, token) => {
    const missingInputs = [];
    if (!accountId)
        missingInputs.push('accountId');
    if (!toggleValue)
        missingInputs.push('toggleValue');
    if (!sdkKey)
        missingInputs.push('sdkKey');
    if (!token)
        missingInputs.push('token');
    if (missingInputs.length > 0) {
        throw new Error(`Missing required inputs: ${missingInputs.join(', ')}`);
    }
    if (isNaN(parseInt(toggleValue)) || ![0, 1].includes(parseInt(toggleValue))) {
        throw new Error('Invalid toggleValue. Please provide 1 for enabling the feature flag or 0 for disabling the feature flag');
    }
};
exports.validateInputs = validateInputs;
/**
 * Get inputs from the action
 * @returns {accountId, featureId, toggleValue, sdkKey, token}
 */
const getInputs = () => {
    return {
        accountId: process.env.VWO_ACCOUNT_ID,
        toggleValue: core.getInput('toggleValue'),
        sdkKey: process.env.VWO_SDK_KEY,
        token: process.env.VWO_API_TOKEN,
    };
};
exports.getInputs = getInputs;
/**
 * Toggle feature flag
 * @param accountId
 * @param featureId
 * @param toggleValue Toggle value, use 1 for enable and 0 for disable
 * @param token VWO_API_TOKEN environment variable
 * @param sdkKey VWO_SDK_KEY environment variable
 * @returns
 */
const flagToggle = (accountId, featureId, toggleValue, token, sdkKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${constants_1.Constants.HTTPS_PROTOCOL}${constants_1.Constants.VWO_APP_URL}/api/v2/accounts/${accountId}/environments/${sdkKey}/features/${featureId}/toggle`;
        // Set headers directly in the request
        const headers = {
            token: token,
        };
        const response = yield axios_1.default.patch(url, {
            isEnabled: toggleValue,
        }, { headers });
        if (response.data && response.data._data && response.data._data[featureId]) {
            return response.data._data[featureId].isEnabled;
        }
        return null;
    }
    catch (error) {
        core.setFailed(`Unable to toggle feature flag: ${error instanceof Error ? error.message : String(error)}`);
        return null;
    }
});
exports.flagToggle = flagToggle;
