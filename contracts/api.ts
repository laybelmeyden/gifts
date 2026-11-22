export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fields?: Partial<Record<string, string>>;
  };
};
