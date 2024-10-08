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

import { init } from 'vwo-fme-node-sdk';
import { IVWOOptions } from 'vwo-fme-node-sdk/dist/types/models/VWOOptionsModel';

export class VWOClient {
  sdkClientInstance: any;

  /**
   * Initialize the VWO SDK client instance
   * @param options Configuration options for VWO SDK
   */
  constructor(options: IVWOOptions) {
    this.sdkClientInstance = init(options);
  }

  /**
   * Get the VWO client instance
   * @returns VWO SDK client instance
   */
  async getSDKClientInstance(): Promise<any> {
    return await this.sdkClientInstance;
  }

  /**
   * Evaluate feature flag for a given user and return its value
   * @param flagKey Feature flag key
   * @param userContext User context
   * @returns {Promise<Record<any, any>>} The evaluated feature flag value or an empty object on failure
   */
  async getFlagValue(flagKey: string, userContext: Record<string, any>): Promise<Record<any, any>> {
    const sdkClientInstance = await this.getSDKClientInstance();
    const getFlag = await sdkClientInstance.getFlag(flagKey, userContext);
    return getFlag;
  }
}
