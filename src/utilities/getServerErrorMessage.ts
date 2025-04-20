// src/utils.ts (donde se encuentra la función)
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    type ErrorWithResponse = Error & { response?: { status?: number } };
    const status = (error as ErrorWithResponse).response?.status;

    const messages: Record<number, string> = {
      400: "Solicitud incorrecta: El servidor no entendió la petición.",
      403: "Prohibido: No tienes permiso para realizar esta acción.",
      404: "No encontrado: El recurso solicitado no existe.",
      409: "Conflicto de integridad referencial.",
      500: "Error en el servidor: No puedes realizar esta acción debido a la integridad de la información.",
    };

    if (status && messages[status]) {
      return messages[status];
    }

    return error.message;
  }

  return "Ocurrió un error desconocido.";
};
