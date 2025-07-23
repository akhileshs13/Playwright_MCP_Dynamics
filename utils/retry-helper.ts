import logger from "./logger";

export async function retryAction(
  action: () => Promise<void>,
  retries = 2,
  delay = 1000,
  label = 'Action'
): Promise<void> {
  for (let i = 0; i <= retries; i++) {
    try {
      await action();
      return;
    } catch (error) {
      if (i === retries) {
        logger.warn(`${label} failed after ${retries + 1} attempts. Reason:`, error);
        return;
      }
      logger.warn(`[Retry ${i + 1}] ${label} failed. Retrying...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}