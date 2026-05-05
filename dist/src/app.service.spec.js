"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_service_1 = require("./app.service");
(0, vitest_1.describe)('AppService', () => {
    let appService;
    (0, vitest_1.beforeEach)(() => {
        appService = new app_service_1.AppService();
    });
    (0, vitest_1.it)('should return "Hello World!"', () => {
        (0, vitest_1.expect)(appService.getHello()).toBe('Hello World!');
    });
});
//# sourceMappingURL=app.service.spec.js.map