"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unplugin_swc_1 = require("unplugin-swc");
const config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
    plugins: [
        unplugin_swc_1.default.vite({
            module: { type: 'es6' },
            jsc: {
                transform: {
                    legacyDecorator: true,
                    decoratorMetadata: true,
                },
            },
        }),
    ],
    test: {
        globals: true,
        root: './',
        include: ['src/**/*.e2e-spec.ts', 'test/**/*.e2e-spec.ts'],
        globalSetup: ['./test/global-setup-e2e.ts'],
        setupFiles: ['./test/setup-e2e.ts'],
        fileParallelism: false,
    },
});
//# sourceMappingURL=vitest.config.e2e.js.map