import { type Config } from "eslint/config";
import { getIgnores } from "./ignores";
import {
  recommended,
  jsonc,
  jsonSchema,
  prettierConf,
  tsRecommended,
} from "./configs";
import { tsRules } from "./rules";

export const config = async (): Promise<Config[]> => {
  const ignores = await getIgnores();
  return [
    ignores,
    recommended,
    ...jsonc,
    ...jsonSchema,
    prettierConf,
    ...tsRecommended,
    // prettierPlugin,
    tsRules,
  ];
};
