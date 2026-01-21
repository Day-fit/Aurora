import { ApiService } from "@/lib/backend/api-config";

export interface BackendResponse<T = any> {
  status: number;
  data: T;
}
export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
export interface RequestType {
  token?: string | null;
  body?: any | null;
  method?: RequestMethod;
  endpoint: string;
  service?: ApiService;
}
