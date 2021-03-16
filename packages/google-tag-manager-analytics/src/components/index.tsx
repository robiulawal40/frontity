import * as React from "react";
import { Head, Slot, connect, css } from "frontity";
import { Connect } from "frontity/types";
import GoogleTagManagerAnalytics from "../../types";

/**
 * Props used by {@link GtmCode}.
 */
interface GtmCodeProps {
  /**
   * GTM container ID.
   */
  containerId: string;
}

/**
 * Render the GTM library inside `<head>` for the given container ID.
 *
 * @example
 * ```
 * <GtmCode containerId={containerId} />
 * ```
 *
 * @param props - Object of type {@link GtmCodeProps}.
 *
 * @returns React element.
 */
const GtmCode: React.FC<GtmCodeProps> = ({ containerId }) => (
  <>
    {/* Add the GTM script in the <head> */}
    <Head>
      <script
        async
        src={`https://www.googletagmanager.com/gtm.js?id=${containerId}`}
      />
      <script>
        {`
        var dataLayer = window.dataLayer || [];
        dataLayer.push({
          "gtm.start": new Date().getTime(),
          event: "gtm.js",
        })
        `}
      </script>
    </Head>
    {/* Add the GTM noscript in the <body> */}
    <noscript>
      <iframe
        title={containerId}
        src={`https://www.googletagmanager.com/ns.html?id=${containerId}`}
        height="0"
        width="0"
        css={css`
          display: none;
          visibility: hidden;
        `}
      />
    </noscript>
  </>
);

/**
 * Render the `amp-analytics` tag for the given container ID.
 *
 * @example
 * ```
 * <GtmCodeAmp containerId={containerId} />
 * ```
 *
 * @param props - Object of type {@link GtmCodeProps}.
 *
 * @returns React element.
 */
const GtmCodeAmp: React.FC<GtmCodeProps> = ({ containerId }) => (
  <amp-analytics
    config={`https://www.googletagmanager.com/amp.json?id=${containerId};Tag Manager.url=SOURCE_URL`}
    data-credentials="include"
  >
    <Slot name="Google Tag Manager Analytics - Inside <amp-analytics>" />
  </amp-analytics>
);

/**
 * Root component of the Comscore Analytics package.
 *
 * It renders the Comscore script library for each Comscore tracking ID defined
 * in the state.
 *
 * @remarks
 * This component is automatically rendered by Frontity and it's not meant to be
 * imported and used anywhere.
 *
 * @param props - Injected props by `connect`.
 *
 * @returns Root element.
 */
export const Root: React.FC<Connect<GoogleTagManagerAnalytics>> = ({
  state,
}) => {
  const { containerId, containerIds } = state.googleTagManagerAnalytics;
  const ids = containerIds || (containerId && [containerId]) || [];

  // Get the appropriate tag depending on whether the `@frontity/amp` package is
  // installed or not.
  const GtmTag = "amp" in state ? GtmCodeAmp : GtmCode;

  return (
    <>
      {ids.map((id) => (
        <GtmTag key={id} containerId={id} />
      ))}
    </>
  );
};

export default connect(Root);
