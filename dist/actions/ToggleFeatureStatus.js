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
exports.featureFlagToggle = void 0;
const core = __importStar(require("@actions/core"));
const ToggleFlag_1 = require("../utils/ToggleFlag");
const ToggleFlag_2 = require("../utils/ToggleFlag");
const featureFlagToggle = (featureId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId, toggleValue, sdkKey, token } = (0, ToggleFlag_2.getInputs)();
        (0, ToggleFlag_2.validateInputs)(accountId, featureId, toggleValue, sdkKey, token);
        core.startGroup('Toggle feature flag');
        const featureFlagIsEnabled = yield (0, ToggleFlag_1.flagToggle)(accountId, featureId, parseInt(toggleValue), token, sdkKey);
        if (featureFlagIsEnabled === null) {
            throw new Error(`Failed to toggle feature flag ${featureId}`);
        }
        core.info(`Feature flag ${featureId} is ${featureFlagIsEnabled ? 'enabled' : 'disabled'}`);
        core.endGroup();
        core.setOutput('featureFlagStatus', featureFlagIsEnabled);
    }
    catch (error) {
        core.setFailed(`Error in Toggle Feature Status action: ${error instanceof Error ? error.message : String(error)}`);
    }
});
exports.featureFlagToggle = featureFlagToggle;
