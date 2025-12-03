import { objectEntries, objectFromEntries } from "../types/object";

type I18nConfig = Pick<
  StarlightIntegrationOptions,
  "defaultLocale" | "locales" | "title"
>;

type Locale = {
  dir: "ltr" | "rtl";
  label: string;
  lang: string;
};

type LocalesRecord<Lang extends string> = {
  readonly [L in Lang]: {
    readonly dir: "ltr" | "rtl";
    readonly label: string;
    readonly title: string;
  };
};

type StarlightIntegrationOptions = {
  defaultLocale?: string;
  locales?: Record<string, Locale>;
  title: Record<string, string> | string;
};

export const defineI18nConfig = <Lang extends string>(
  locales: LocalesRecord<Lang>,
): I18nConfig => {
  const localesArr = objectEntries(locales).map(
    ([
      lang,
      obj,
    ]) => ({
      ...obj,
      lang,
    }),
  );
  const langs = localesArr.map(l => l.lang);

  const defaultLocale = langs[0];

  if (!defaultLocale) {
    throw new Error("You must define at least one language");
  }

  return {
    defaultLocale,
    locales: objectFromEntries<Record<string, Locale>>(
      localesArr.map(({ dir, label, lang }) => [
        lang,
        {
          dir,
          label,
          lang,
        },
      ]),
    ),
    title: objectFromEntries<Record<string, string>>(
      localesArr.map(l => [
        l.lang,
        l.title,
      ]),
    ),
  };
};
