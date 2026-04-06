import i18n from "mt-block-editor-block/i18n";

const translations = import.meta.glob<{ default: object }>(
  "./locales/*/translation.json",
  { eager: true, import: "default" }
);

i18n.on("initialized", () => {
  for (const path in translations) {
    const match = path.match(/\.\/locales\/(\w+)\/translation\.json/);
    if (match) {
      const lang = match[1];
      i18n.addResourceBundle(lang, "translation", translations[path], true, false);
    }
  }
});

export function t(
  args: string | string[],
  params?: Record<string, unknown>
): string {
  return i18n.t(args, params);
}
