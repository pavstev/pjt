import cspell from "@cspell/eslint-plugin";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import n from "eslint-plugin-n";
import regexp from "eslint-plugin-regexp";
import sonarjs from "eslint-plugin-sonarjs";
import ts from "typescript-eslint";

import {
  type EslintEntry,
  fromRootPath,
  testFiles,
  tsFiles,
} from "../constants";

export const source: EslintEntry[] = [
  ts.configs.recommendedTypeChecked.map(
    (config): EslintEntry => ({
      ...config,
      files: tsFiles,
    }),
  ),
  {
    ...regexp.configs["flat/recommended"],
    files: tsFiles,
  },
  {
    ...n.configs["flat/recommended-module"],
    files: tsFiles,
  },
  {
    files: tsFiles,
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: tsFiles,
    plugins: {
      "@cspell": cspell,
      n,
      regexp,
      sonarjs,
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      ...regexp.configs.recommended.rules,
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          fixStyle: "separate-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "off",
        // { accessibility: "explicit" },
      ],
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/no-extraneous-class": [
        "error",
        { allowWithDecorator: false },
      ],
      "@typescript-eslint/no-inferrable-types": [
        "error",
        { ignoreParameters: false, ignoreProperties: false },
      ],
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/unbound-method": "off",
      "arrow-body-style": ["error", "as-needed"],
      "curly": ["error", "all"],
      "eqeqeq": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-yields-type": "off",
      "logical-assignment-operators": ["error", "always"],
      "max-depth": ["error", 4],
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
      "no-else-return": "error",
      "no-implicit-coercion": "error",
      "no-lonely-if": "error",
      "no-nested-ternary": "off",
      "no-param-reassign": "error",
      "no-redeclare": "off",
      "no-restricted-syntax": [
        "error",
        {
          message:
            "Use an object or a Map instead of 'switch' statements. SPE0P1",
          selector: "SwitchStatement",
        },
        {
          message:
            "Use an arrow function assigned to a variable instead of function declarations. SPE0P2",
          selector: "FunctionDeclaration",
        },
        {
          message:
            "Use an arrow function instead of function expressions. SPE0P3",
          selector:
            "FunctionExpression:not(MethodDefinition > FunctionExpression):not(PropertyDefinition > FunctionExpression)",
        },
        // {
        //   selector: "ExportNamedDeclaration[declaration=null]",
        //   message:
        //     "Use inline exports instead of grouped export statements. SPE0P4",
        // },
        {
          message:
            "Namespace import of React is forbidden. Use named imports instead.",
          selector: "ImportNamespaceSpecifier[local.name='React']",
        },
        {
          message:
            "Array.prototype.forEach is forbidden. Use for...of or other iteration constructs instead.",
          selector: "CallExpression[callee.property.name='forEach']",
        },
      ],
      "no-undef": "off",
      "no-unneeded-ternary": "error",
      "no-unused-vars": "off",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "object-shorthand": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", next: "*", prev: "if" },
      ],
      "prefer-const": "error",
      "prefer-destructuring": ["error", { array: false, object: true }],
      "prefer-object-spread": "error",
      "prefer-template": "error",
      "require-atomic-updates": "error",
      "sonarjs/cognitive-complexity": ["error", 10],
      "sonarjs/no-commented-code": "error",
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-nested-template-literals": "off",
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: [fromRootPath("tsconfig.json", "resolve", import.meta)],
        }),
      ],
    },
  },
  {
    files: [...testFiles, "**/*.config.ts", "**/main.ts"],
    plugins: {
      sonarjs,
    },
    rules: {
      "sonarjs/no-duplicate-string": "off",
    },
  },
];
