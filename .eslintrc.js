module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  settings: { tailwindcss: { groupByResponsive: true } },
  plugins: ["simple-import-sort", "tailwindcss", "import-access"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:tailwindcss/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    //console.log()をエラーにする
    "no-console": ["error", { allow: ["warn", "info", "error"] }],
    //禁止構文の指定。今回はtsでEnum型を使うのを禁止
    "no-restricted-syntax": [
      "error",
      { selector: "TSEnumDeclaration", message: "Don't declare enums" },
    ],
    //関数は必ずコールバック関数で指定
    "prefer-arrow-callback": "error",
    //変数定義は原則constを指定
    "prefer-const": "error",
    //関数式、関数宣言のどちらか一貫した構文を指定。expressionでは関数式を指定
    "func-style": ["error", "expression"],
    //アロー関数本体に必ず{}が必要
    "arrow-body-style": ["error", "always"],
    //特定のimportを禁止する。今回はreactのimportを禁止
    "no-restricted-imports": [
      "error",
      { paths: [{ name: "react", importNames: ["default"] }] },
    ],
    //Reactの組み込み型、型チェックをオフ
    "react/prop-types": "off",
    //import React の記述をオフ
    "react/react-in-jsx-scope": "off",
    //無名関数を返さない
    "react/display-name": "error",
    //propsの渡し方 "never"の場合、propsのままComponent内で使用する
    "react/destructuring-assignment": ["error", "never"],
    //react-hookのルールに沿っているか
    "react-hooks/rules-of-hooks": "error",
    //useEffectの[]内部のルール指定
    "react-hooks/exhaustive-deps": "warn",
    //import文の後に、空の空行を追加する
    "import/newline-after-import": "error",
    // default exportを禁止
    "import/no-default-export": "error",
    "import-access/jsdoc": "error",
    //import文の並び替え
    "simple-import-sort/imports": "error",
    //export文の並び替え
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
      { selector: ["property", "method"], format: ["camelCase"] },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["no", "is", "has", "should"],
        filter: { regex: "^_", match: false },
      },
    ],
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
  },
  overrides: [
    {
      files: ["src/pages/**/*.{tsx, ts}"],
      rules: {
        "import/no-default-export": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
          {
            selector: ["classProperty", "typeProperty", "method"],
            format: ["camelCase"],
          },
          {
            selector: "variable",
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "has", "should"],
          },
        ],
      },
    },
  ],
};

// module.exports = {
//   root: true,
//   parser: "@typescript-eslint/parser",
//   parserOptions: { project: "./tsconfig.json" },
//   env: { es2021: true, browser: true, jest: true, node: true },
//   plugins: ["simple-import-sort"],
//   extends: [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:jsx-a11y/recommended",
//     "next",
//     "next/core-web-vitals",
//     "prettier",
//   ],
//   rules: {
//     "no-console": ["error", { allow: ["warn", "info", "error"] }],
//     "no-restricted-syntax": [
//       "error",
//       { selector: "TSEnumDeclaration", message: "Don't declare enums" },
//     ],
//     "prefer-arrow-callback": "error",
//     "prefer-const": "error",
//     "func-style": ["error", "expression"],
//     "arrow-body-style": ["error", "always"],
//     "no-restricted-imports": [
//       "error",
//       { paths: [{ name: "react", importNames: ["default"] }] },
//     ],
//     "react/prop-types": "off",
//     "react/react-in-jsx-scope": "off",
//     "react/display-name": "error",
//     "react/jsx-handler-names": [
//       "error",
//       {
//         eventHandlerPrefix: "handle",
//         eventHandlerPropPrefix: "on",
//         checkLocalVariables: true,
//         checkInlineFunction: true,
//       },
//     ],
//     "react/destructuring-assignment": ["error", "never"],
//     "react-hooks/rules-of-hooks": "error",
//     "react-hooks/exhaustive-deps": "warn",
//     "import/newline-after-import": "error",
//     "import/no-default-export": "error",
//     "simple-import-sort/imports": "error",
//     "simple-import-sort/exports": "error",
//     "@typescript-eslint/no-explicit-any": "off",
//     "@typescript-eslint/no-var-requires": "off",
//     "@typescript-eslint/explicit-module-boundary-types": "off",
//     "@typescript-eslint/consistent-type-imports": [
//       "warn",
//       { prefer: "type-imports" },
//     ],
//     "@typescript-eslint/no-unused-vars": [
//       "error",
//       { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
//     ],
//     "@typescript-eslint/naming-convention": [
//       "error",
//       { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
//       { selector: ["property", "method"], format: ["camelCase"] },
//       {
//         selector: "variable",
//         types: ["boolean"],
//         format: ["PascalCase"],
//         prefix: ["no", "is", "has", "should"],
//         filter: { regex: "^_", match: false },
//       },
//     ],
//     "jsx-a11y/no-autofocus": "off",
//     "jsx-a11y/anchor-is-valid": [
//       "error",
//       {
//         components: ["Link"],
//         specialLink: ["hrefLeft", "hrefRight"],
//         aspects: ["invalidHref", "preferButton"],
//       },
//     ],
//   },
//   overrides: [
//     {
//       files: ["src/pages/**/*.tsx", "src/pages/api/**/*.ts"],
//       rules: { "import/no-default-export": "off" },
//     },
//   ],
// };
