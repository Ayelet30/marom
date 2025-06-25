import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'https://data.gov.il/api/3/action/datastore_search';
  private resourceId = '8f3c913e-8c85-4df8-9110-220d5c06e55c';

  constructor(private http: HttpClient) {}

 getCities(): Observable<{ id: string; name: string }[]> {
  return this.http.get<{ id: string; name: string }[]>(
        'https://getcities-cvfeey4zvq-uc.a.run.app/'

  );
}

}
