export interface BackendResponse<T = any> {
  status: number;
  data: T;
}
export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
export interface RequestType {
  token?: string | null;
  body?: any | null;
  method?: RequestMethod;
  endpoint: string;
}
