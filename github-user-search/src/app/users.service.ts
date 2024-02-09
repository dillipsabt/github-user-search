import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    const url = `${this.baseUrl}/users?per_page=50`;
    return this.http.get<any[]>(url);
  }

  searchUsers(query: string): Observable<any[]> {
    if (!query.trim()) {
      return new Observable<any[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    const url = `${this.baseUrl}/search/users?q=${query}&per_page=50`;
    return this.http.get<any[]>(url).pipe(
      map((response: any) => response.items)
    );
  }
}
