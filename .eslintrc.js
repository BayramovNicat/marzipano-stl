module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    globals: {
        Marzipano: "readonly",
    },
    extends: "eslint:recommended",
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "prefer-const": [
            "error",
            {
                destructuring: "any",
                ignoreReadBeforeAssign: false,
            },
        ],
    },
};
