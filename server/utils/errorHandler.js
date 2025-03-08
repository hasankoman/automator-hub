export const ErrorTypes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  INTERNAL: "INTERNAL",
  PLAN_LIMIT_REACHED: "PLAN_LIMIT_REACHED",
};

export const createApiError = (type, message, originalError = null) => {
  const errors = {
    [ErrorTypes.UNAUTHORIZED]: {
      statusCode: 401,
      message: message || "Unauthorized",
    },
    [ErrorTypes.NOT_FOUND]: {
      statusCode: 404,
      message: message || "Not Found",
    },
    [ErrorTypes.VALIDATION]: {
      statusCode: 400,
      message: message || "Validation Error",
    },
    [ErrorTypes.INTERNAL]: {
      statusCode: 500,
      message: message || "Internal Server Error",
    },
    [ErrorTypes.PLAN_LIMIT_REACHED]: {
      statusCode: 403,
      message: message || "Plan action limit reached",
    },
  };
  console.log("errors", errors[type]);

  const error = errors[type] || errors[ErrorTypes.INTERNAL];
  if (originalError) {
    console.error(originalError);
  }

  console.log(error);

  throw createError(error);
};
