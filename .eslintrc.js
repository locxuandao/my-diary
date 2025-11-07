module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      { singleQuote: true, semi: true, trailingComma: "all", printWidth: 100 },
    ],
  },
};
