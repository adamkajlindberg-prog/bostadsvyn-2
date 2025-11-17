export const jsonParse = <T extends object>(jsonString: string): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (e: unknown) {
    throw Error(
      `Could not parse ${jsonString} to JSON ${e instanceof Error ? e.message : e}`,
    );
  }
};

export function truncateMessage(
  message: unknown,
  maxDepth = 10,
  currentDepth = 0,
  maxProperties = 50,
): unknown {
  // If we've reached max depth, truncate
  if (currentDepth >= maxDepth) {
    if (typeof message === "string") {
      return message.length > 50 ? `${message.substring(0, 50)}...` : message;
    }
    if (typeof message === "object" && message !== null) {
      return Array.isArray(message) ? "[Array]" : "[Object]";
    }
    return message;
  }

  if (typeof message === "string") {
    // Special handling for very long strings (like base64 data)
    if (message.length > 100) {
      // Check if it looks like base64 data
      const isBase64 = /^[A-Za-z0-9+/]*={0,2}$/.test(message);
      if (isBase64) {
        return `[base64 data - ${message.length} chars]`;
      }
      // For other long strings, truncate to first 50 chars
      return `${message.substring(0, 50)}... [${message.length} chars total]`;
    }
    return message;
  }

  if (typeof message === "object" && message !== null) {
    if (Array.isArray(message)) {
      // Truncate arrays to first 10 items
      const truncatedArray = message
        .slice(0, 10)
        .map((item) =>
          truncateMessage(item, maxDepth, currentDepth + 1, maxProperties),
        );
      if (message.length > 10) {
        truncatedArray.push(`... and ${message.length - 10} more items`);
      }
      return truncatedArray;
    }

    const truncated: Record<string, unknown> = {};
    const entries = Object.entries(message);

    // Limit the number of properties processed
    const limitedEntries = entries.slice(0, maxProperties);

    for (const [key, value] of limitedEntries) {
      truncated[key] = truncateMessage(
        value,
        maxDepth,
        currentDepth + 1,
        maxProperties,
      );
    }

    // Add indication if properties were truncated
    if (entries.length > maxProperties) {
      truncated[`... and ${entries.length - maxProperties} more properties`] =
        "[truncated]";
    }

    return truncated;
  }

  return message;
}

export function jsonStringifyTruncated(
  message: unknown,
  maxDepth = 10,
  maxProperties = 50,
): string {
  return JSON.stringify(
    truncateMessage(message, maxDepth, 0, maxProperties),
    null,
    2,
  );
}
