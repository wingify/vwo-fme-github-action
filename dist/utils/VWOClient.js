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
exports.VWOClient = void 0;
const vwo_fme_node_sdk_1 = require("vwo-fme-node-sdk");
class VWOClient {
    /**
     * Initialize the VWO SDK client instance
     * @param options Configuration options for VWO SDK
     */
    constructor(options) {
        this.sdkClientInstance = (0, vwo_fme_node_sdk_1.init)(options);
    }
    /**
     * Get the VWO client instance
     * @returns VWO SDK client instance
     */
    getSDKClientInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sdkClientInstance;
        });
    }
    /**
     * Evaluate feature flag for a given user and return its value
     * @param flagKey Feature flag key
     * @param userContext User context
     * @returns {Promise<Record<any, any>>} The evaluated feature flag value or an empty object on failure
     */
    getFlagValue(flagKey, userContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdkClientInstance = yield this.getSDKClientInstance();
            const getFlag = yield sdkClientInstance.getFlag(flagKey, userContext);
            return getFlag;
        });
    }
}
exports.VWOClient = VWOClient;
