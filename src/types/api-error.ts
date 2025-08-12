/**
 * Represents a validation error from the API
 */
export interface ValidationError {
  [field: string]: string | string[]
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse<T = unknown> extends Error {
  response?: {
    data?: {
      message?: string
      errors?: ValidationError | string[]
      data?: T
    }
    status?: number
    statusText?: string
  }
}

/**
 * Type guard to check if an error is an API error response
 */
export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    error.response !== null &&
    typeof error.response === 'object'
  )
}

/**
 * Extracts validation errors from an API error response
 */
export function extractValidationErrors(error: unknown): ValidationError | null {
  if (!isApiErrorResponse(error)) {
    return null
  }

  const { errors } = error.response?.data || {}

  if (!errors) {
    return null
  }

  // Handle array of error messages
  if (Array.isArray(errors)) {
    return errors.reduce<ValidationError>((acc, errorMsg) => {
      const fieldMatch = errorMsg.toLowerCase().match(/the (\w+) is required/i)
      if (fieldMatch && fieldMatch[1]) {
        const fieldName = fieldMatch[1]
        acc[fieldName] = errorMsg
      }
      return acc
    }, {})
  }

  // Handle object of field errors
  return Object.entries(errors).reduce<ValidationError>((acc, [field, messages]) => {
    if (Array.isArray(messages)) {
      acc[field] = messages[0] // Take the first error message for each field
    } else {
      acc[field] = messages
    }
    return acc
  }, {})
}
