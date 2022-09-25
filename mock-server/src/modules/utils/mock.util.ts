/* eslint-disable prettier/prettier */
import { LowdbService } from '../../lowdb/lowdb.service';
export async function initBase(lowdbService: LowdbService, base: string) {
  await lowdbService.initDatabase(base);
}
