import getApiUrlService from "@/services/get-api-url.service";
import fileProcessConfig from "@/config/file-process.config";
import HttpMethodsEnum from "@/enums/http-methods.enum";

export default async function postSheetService(formData: FormData) {
  const { uris } = fileProcessConfig;

  const endpoint = getApiUrlService(uris.uploadSheet);

  const response = await fetch(endpoint, {
    method: HttpMethodsEnum.POST,
    body: formData,
  });

  return response.json();
}