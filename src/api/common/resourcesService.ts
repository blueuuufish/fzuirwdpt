import { Observable,from} from 'rxjs';
import request from '@/utils/request';
export function useResourcesService() {
  const getImageAsFile = (imageUrl: string): Observable<File> => {
    return from(
      request.get({url:imageUrl,responseType: 'blob'})
        .then(response => new File([response.data], imageUrl, { type: "image/jpeg" }))
    );
  }
  return{
    getImageAsFile
  };
}