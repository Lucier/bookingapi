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
        include: ['src/**/*.spec.ts'],
        setupFiles: [],
    },
});
//# sourceMappingURL=vitest.config.js.map