import { t } from "../i18n";
import React, {
  useState,
  useEffect,
  useCallback,
} from "mt-block-editor-block/React";
import { blockProperty } from "mt-block-editor-block/decorator";
import {
  BlockIframePreview,
  BlockSetupCommon,
  BlockLabel,
} from "mt-block-editor-block/Component";
import Block, {
  Metadata,
  NewFromHtmlOptions,
  EditorOptions,
  SerializeOptions,
} from "mt-block-editor-block/Block";
import { useEditorContext } from "mt-block-editor-block/Context";

import icon from "../img/icon/oembed.svg";
import css from "../css/Oembed.scss";

interface EditorProps {
  block: Oembed;
}

interface HtmlProps {
  block: Oembed;
}

type OembedData = Record<string, string>;

type Resolver = (params: {
  url: string;
  maxwidth: number | null;
  maxheight: number | null;
}) => Promise<OembedData>;

const Editor: React.FC<EditorProps> = blockProperty(
  ({ block }: EditorProps) => {
    const { editor } = useEditorContext();

    const reset = useCallback(() => {
      block.reset();
    }, []);
    useEffect(() => {
      editor.on("change", reset);
      return () => {
        editor.off("change", reset);
      };
    });

    return (
      <div className={css.Oembed}>
        <BlockSetupCommon block={block} keys={["label", "helpText"]} />
        <BlockLabel block={block}>
          <label className="mt-be-label-name">
            <div>{t("URL")}</div>
            <input
              type="url"
              data-property-name="url"
              data-mt-block-editor-focus-default
            />
          </label>
          <label className="mt-be-label-name">
            <div>{t("Max Width (optional)")}</div>
            <input type="number" data-property-name="maxwidth" />
          </label>
          <label className="mt-be-label-name">
            <div>{t("Max Height (optional)")}</div>
            <input type="number" data-property-name="maxheight" />
          </label>
        </BlockLabel>
      </div>
    );
  }
);

const Html: React.FC<HtmlProps> = ({ block }: HtmlProps) => {
  const { editor } = useEditorContext();
  const [, setCompiledHtml] = useState("");

  useEffect(() => {
    (async () => {
      if (block.compiledHtml) {
        return;
      }

      await block.compile({ editor });
      setCompiledHtml(block.compiledHtml);
    })();
  });

  return block.compiledHtml ? (
    <BlockIframePreview
      key={block.id}
      block={block}
      html={block.compiledHtml}
    />
  ) : (
    <>{block.url}</>
  );
};

class Oembed extends Block {
  public static typeId = "sixapart-oembed";
  public static selectable = true;
  public static shouldBeCompiled = true;
  public static icon = icon;
  public static get label(): string {
    return t("oEmbed");
  }

  public url = "";
  public maxwidth: number | null = null;
  public maxheight: number | null = null;
  public resolvedData: OembedData | null = null;

  public constructor(init?: Partial<Oembed>) {
    super();
    if (init) {
      const initData = { ...init };
      const ownKeys = Reflect.ownKeys(this).filter(
        (k) => typeof k === "string"
      ) as (keyof Oembed)[];
      for (const k of ownKeys) {
        if (k in initData) {
          (this as Record<string, any>)[k] = initData[k];
          delete initData[k];
        }
      }
      if (Object.keys(initData).length > 0) {
        this.resolvedData = initData as OembedData;
      }
    }
  }

  public metadata(): Metadata | null {
    const meta = this.metadataByOwnKeys();
    if (meta?.resolvedData) {
      const d = meta.resolvedData;
      delete meta.resolvedData;
      Object.assign(meta, d);
    }
    return meta;
  }

  public editor({ focus, focusBlock }: EditorOptions): JSX.Element {
    if (focus || focusBlock) {
      return <Editor key={this.id} block={this} />;
    } else if (this.url) {
      return this.html();
    } else {
      return (
        <span className="mt-be-placeholder">
          {t("Please input URL to be resolved by oEmbed API")}
        </span>
      );
    }
  }

  public html(): JSX.Element {
    return <Html key={this.id} block={this} />;
  }

  public async serializedString(): Promise<string> {
    return "";
  }

  public async compile({ editor }: SerializeOptions): Promise<void> {
    if (!this.url) {
      this.reset();
      return;
    }

    const opts = editor.opts.block["sixapart-oembed"] || {};
    if (typeof opts.resolver !== "function") {
      throw "Requires resolver function for sixapart-oembed.";
    }
    const resolver = opts.resolver as Resolver;
    try {
      const res = await resolver({
        url: this.url,
        maxwidth: this.maxwidth || null,
        maxheight: this.maxheight || null,
      });

      if (!res.html) {
        throw res;
      }

      this.compiledHtml = res.html;
      this.resolvedData = {};
      for (const k in res) {
        if (k === "html") {
          continue;
        }
        const jsonKey = k.replace(/_(.)/g, (_, c) => c.toUpperCase());
        this.resolvedData[jsonKey] = res[k];
      }
    } catch (e) {
      this.reset();
      this.compiledHtml = t(
        "Could not retrieve HTML for embedding from {{URL}}",
        {
          URL: this.url,
        }
      );
    }
  }

  public static async newFromHtml({
    html,
    meta,
  }: NewFromHtmlOptions): Promise<Oembed> {
    return new Oembed({ compiledHtml: html, ...meta });
  }

  public reset(): void {
    this.compiledHtml = "";
    this.resolvedData = null;
  }
}

export default Oembed;
