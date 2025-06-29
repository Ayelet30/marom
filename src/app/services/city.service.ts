import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) {}

 getCities(): Observable<{ id: string; name: string }[]> {
  return this.http.get<string[]>('https://getcities-cvfeey4zvq-uc.a.run.app/').pipe(
    map((cities: string[]) =>
      cities.map((cityName, index) => ({
        id: index.toString(),
        name: cityName
      }))
    )
  );
}


}
