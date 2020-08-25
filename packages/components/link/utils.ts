/**
 * Configuration for the prefetcher behaviour.
 */
const config = {
  /**
   * The number of miliseconds to wait until the hover triggers the prefetch.
   *
   * We can avoid prefetching when the mouse is moving quickly through a menu,
   * without pausing in a specific link.
   */
  hoverDelay: 50,

  /**
   * The number of requests per batch.
   *
   * We can avoid doing too many requests at the same time.
   */
  requestsPerBatch: 4,

  /**
   * Time between different batch intervals.
   */
  batchInterval: 1000,
};

/**
 * Controls the processing queue of the links.
 */
export class Queue {
  /**
   * Indicates whether the queue is processing or not.
   */
  isProcessing = false;

  /**
   * Set to store the links that need to be prefetched.
   */
  toPrefetch = new Set<string>();

  /**
   * Process the queue of links to prefetch.
   *
   * @param prefetcher - The function used to prefetch the link.
   */
  process(prefetcher: (link: string) => void) {
    let batchInterval: ReturnType<typeof setInterval> = null;

    /**
     * Process a batch of prefetches.
     */
    const process = () => {
      const batch = Array.from(this.toPrefetch).slice(
        0,
        config.requestsPerBatch
      );

      // if batch is empty, stop process and allow it to run again if necessary.
      if (batch.length === 0) {
        this.isProcessing = false;
        clearTimeout(batchInterval);
        return;
      }

      batch.forEach((link) => {
        prefetcher(link);
        this.toPrefetch.delete(link);
      });
    };

    batchInterval = setInterval(() => {
      process();
    }, config.batchInterval);
  }
}

/**
 * Executes the callback when the hover event is triggered for the element.
 *
 * @param el - The element to watch for hover events.
 * @param cb - The callback that should run should an hover event happen.
 *
 * @returns A callback that removes the event listeners.
 */
export const onHover = (el: HTMLAnchorElement, cb: () => void) => {
  let timeout: ReturnType<typeof setTimeout> = null;

  /**
   * When the mouse is moved over the element, if delays the call of the
   * callback for a number of miliseconds, as configured in
   * `config.hoverDelay`.
   */
  const mouseOverHandler = () => {
    timeout = setTimeout(() => {
      cb();
    }, config.hoverDelay);
  };

  /**
   * Removes the timeout to avoid executing the callback if when the mouse is
   * moved out of the element.
   */
  const mouseOutHandler = () => {
    clearTimeout(timeout);
  };

  el.addEventListener("mouseover", mouseOverHandler);
  el.addEventListener("mouseout", mouseOutHandler);

  return () => {
    el.removeEventListener("mouseover", mouseOverHandler);
    el.removeEventListener("mouseout", mouseOutHandler);
  };
};
