"use strict";
/*!
 * Copyright (c) 2017-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const data_view_1 = require("./data-view");
class Config {
    constructor({ debug = false, enableCompression = false, enableHtmlFiltering = false, enableInMemoryCache = true, enableMutationObserver = true, enableOptimizations = true, guessRequestTypeFromUrl = false, integrityCheck = true, loadCSPFilters = true, loadCosmeticFilters = true, loadExceptionFilters = true, loadExtendedSelectors = false, loadGenericCosmeticsFilters = true, loadNetworkFilters = true, } = {}) {
        this.debug = debug;
        this.enableCompression = enableCompression;
        this.enableHtmlFiltering = enableHtmlFiltering;
        this.enableInMemoryCache = enableInMemoryCache;
        this.enableMutationObserver = enableMutationObserver;
        this.enableOptimizations = enableOptimizations;
        this.guessRequestTypeFromUrl = guessRequestTypeFromUrl;
        this.integrityCheck = integrityCheck;
        this.loadCSPFilters = loadCSPFilters;
        this.loadCosmeticFilters = loadCosmeticFilters;
        this.loadExceptionFilters = loadExceptionFilters;
        this.loadExtendedSelectors = loadExtendedSelectors;
        this.loadGenericCosmeticsFilters = loadGenericCosmeticsFilters;
        this.loadNetworkFilters = loadNetworkFilters;
    }
    static deserialize(buffer) {
        return new Config({
            debug: buffer.getBool(),
            enableCompression: buffer.getBool(),
            enableHtmlFiltering: buffer.getBool(),
            enableInMemoryCache: buffer.getBool(),
            enableMutationObserver: buffer.getBool(),
            enableOptimizations: buffer.getBool(),
            guessRequestTypeFromUrl: buffer.getBool(),
            integrityCheck: buffer.getBool(),
            loadCSPFilters: buffer.getBool(),
            loadCosmeticFilters: buffer.getBool(),
            loadExceptionFilters: buffer.getBool(),
            loadExtendedSelectors: buffer.getBool(),
            loadGenericCosmeticsFilters: buffer.getBool(),
            loadNetworkFilters: buffer.getBool(),
        });
    }
    getSerializedSize() {
        // NOTE: this should always be the number of attributes and needs to be
        // updated when `Config` changes.
        return 14 * (0, data_view_1.sizeOfBool)();
    }
    serialize(buffer) {
        buffer.pushBool(this.debug);
        buffer.pushBool(this.enableCompression);
        buffer.pushBool(this.enableHtmlFiltering);
        buffer.pushBool(this.enableInMemoryCache);
        buffer.pushBool(this.enableMutationObserver);
        buffer.pushBool(this.enableOptimizations);
        buffer.pushBool(this.guessRequestTypeFromUrl);
        buffer.pushBool(this.integrityCheck);
        buffer.pushBool(this.loadCSPFilters);
        buffer.pushBool(this.loadCosmeticFilters);
        buffer.pushBool(this.loadExceptionFilters);
        buffer.pushBool(this.loadExtendedSelectors);
        buffer.pushBool(this.loadGenericCosmeticsFilters);
        buffer.pushBool(this.loadNetworkFilters);
    }
}
exports.default = Config;
//# sourceMappingURL=config.js.map