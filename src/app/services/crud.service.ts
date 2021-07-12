import { HttpClient } from "@angular/common/http";
import { delay, take } from "rxjs/operators";

export class CrudService<T> {
  constructor(protected http: HttpClient, private API_URL) {}

  findAll() {
    return this.http.get<T[]>(`${this.API_URL}`).pipe(
      take(1),
      delay(2000)
    );
  }

  findByID(id) {
    return this.http.get<T>(`${this.API_URL}/${id}`).pipe(take(1));
  }

  private create(record: T) {
    return this.http.post(`${this.API_URL}`, record).pipe(take(1));
  }

  private update(record: T) {
    return this.http.put(`${this.API_URL}`, record).pipe(take(1));
  }

  save(record: T) {
    if (record["id"]) {
      return this.update(record);
    }
    return this.create(record);
  }

  remove(id) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(take(1));
  }
}
