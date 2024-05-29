declare module "astro-starlight-remark-asides" {
  /**
   * you must add the respective .css file to the pages you use this on
   *
   * ```
   * :::tip[Tip Example]
   * example tip
   * :::
   * ```
   * 
   * supported callotus: `note`, `tip`, `caution`, `danger` and `success`
   * 
   * dark mode styles are based on `:root[data-theme="dark"]` 
   */
  export default function astroStarlightRemarkAsides(): (tree: any) => void;
}
