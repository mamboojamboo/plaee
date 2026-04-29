import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const featureSliceNames = [
  "crypto-feed",
  "event-feed",
  "event-filter",
  "event-timeframe-filter",
  "price-updates",
  "tags-feed",
  "trade-cta",
];

const widgetSliceNames = [
  "category-nav",
  "crypto-sidebar",
  "crypto-type-chips",
  "event-card",
  "event-detail-header",
  "event-detail-trading-board",
  "events-filter",
];

/** One zone per slice: imports from other slices under the same layer are forbidden. */
const featureCrossSliceZones = featureSliceNames.map((name) => {
  const except = [name];
  return {
    target: `./src/features/${name}/**/*.{ts,tsx}`,
    from: "./src/features",
    except,
    message:
      "Do not import another feature slice’s internals. Use `@/src/features/<slice>` or `@/src/features/<slice>/server`, or lift shared code to `entities` / `shared`.",
  };
});

const widgetCrossSliceZones = widgetSliceNames.map((name) => ({
  target: `./src/widgets/${name}/**/*.{ts,tsx}`,
  from: "./src/widgets",
  except: [name],
  message:
    "Do not import another widget slice. Use `@/src/widgets/<slice>` (public `index.ts` only), or compose in `page-templates`.",
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-restricted-paths": [
        "warn",
        {
          zones: [
            {
              target: "./src/shared",
              from: [
                "./src/entities",
                "./src/features",
                "./src/widgets",
                "./src/page-templates",
              ],
              message:
                "shared must not import from entities, features, widgets, or page-templates (keep shared as the base layer).",
            },
            {
              target: "./src/entities",
              from: [
                "./src/features",
                "./src/widgets",
                "./src/page-templates",
              ],
              message:
                "entities should only import from shared or other entities — not from features, widgets, or page-templates.",
            },
            {
              target: "./src/features",
              from: ["./src/widgets", "./src/page-templates"],
              message:
                "features should not import from widgets or page-templates.",
            },
            {
              target: "./src/widgets",
              from: ["./src/page-templates"],
              message:
                "widgets should not import page-templates; compose full pages in page-templates.",
            },
            ...featureCrossSliceZones,
            ...widgetCrossSliceZones,
          ],
        },
      ],
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              regex: "^@/src/features/[^/]+/(?!server$).+",
              message:
                "Import `@/src/features/<slice>` or `@/src/features/<slice>/server` only — no deep paths into feature internals.",
            },
            {
              regex: "^@/src/widgets/[^/]+/.+",
              message:
                "Import `@/src/widgets/<slice>` only — no deep paths into widget internals.",
            },
            {
              regex: "^@/src/entities/[^/]+/(?!server$).+",
              message:
                "Import `@/src/entities/<slice>` or `@/src/entities/<slice>/server` only — no deep paths into entity internals.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "dist/**",
  ]),
]);

export default eslintConfig;
