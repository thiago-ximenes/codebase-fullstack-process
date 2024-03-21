import serverConfig from "@/config/server.config";

export default function getApiUrlService(endpoint: string) {
  return serverConfig.apiUrl + endpoint;
}