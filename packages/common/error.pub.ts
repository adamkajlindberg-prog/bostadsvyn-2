type ErrorType = {
  name: string | undefined;
  message: string;
  stack: string | undefined;
  cause: string | undefined;
};

// Helper function to safely stringify, avoiding circular reference errors
// biome-ignore lint/suspicious/noExplicitAny: Any is ok here
function safeStringify(obj: any, indent = 2): string {
  const cache = new Set();
  return JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.has(value)) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.add(value);
      }
      return value;
    },
    indent,
  );
}

/**
 * Convert an unknown error to a common error type that can be displayed
 */
export const parseError = (error: unknown): ErrorType => {
  console.log("Parsing error", error);
  if (typeof error === "string") {
    return {
      cause: undefined,
      message: error,
      name: "Error",
      stack: undefined,
    };
  }

  if (error instanceof Error) {
    return {
      cause: safeStringify(error.cause),
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
  }

  if (error && typeof error === "object") {
    // More robust check for error-like objects
    if (
      "name" in error &&
      typeof error.name === "string" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      return {
        cause: "cause" in error ? safeStringify(error.cause) : undefined,
        message: error.message,
        name: error.name,
        stack: "stack" in error ? safeStringify(error.stack) : undefined,
      };
    }
    return {
      cause: undefined,
      message: safeStringify(error),
      name: "Error",
      stack: undefined,
    };
  }

  return {
    cause: undefined,
    message: "UNKNOWN_ERROR",
    name: "Error",
    stack: undefined,
  };
};

export const logError = (message: string, error?: unknown) => {
  if (!error) {
    console.error(`❌ ${message}`);

    // TODO Log to sentry if available
    return;
  }

  const { name, message: errorMessage, stack, cause } = parseError(error);
  console.error(`❌ ${message}
🚨 Error: ${name}
📝 Message: ${errorMessage}
📚 Stack: ${stack}
🎯 Cause: ${cause}`);
  // if (process.env.VITE_SENTRY_DSN) {
  // 	Sentry.captureException(error);
  // }
};
