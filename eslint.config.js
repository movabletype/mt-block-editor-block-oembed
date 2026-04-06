import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

const reactRecommended = reactPlugin.configs.flat.recommended;

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ...reactRecommended.languageOptions,
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...reactRecommended.languageOptions.globals,
        window: "readonly",
      },
    },
    plugins: {
      ...reactRecommended.plugins,
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...reactRecommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      "no-unused-vars": "off",
      "react/prop-types": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],
      "prettier/prettier": "error",
    },
    settings: {
      react: {
        version: "19.0",
      },
    },
  },
];
