import type { JWT } from "google-auth-library";
import type { sheets_v4 } from "googleapis";
import { env } from "~/env";
import { google } from "googleapis";

export type SheetSchema<Row, Key> = {
  serialize: (row: Row) => unknown[];
  deserialize: (data: unknown[]) => Row | null;
  getKey: (row: Row) => Key;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ScheetsSchema = Record<string, SheetSchema<any, any>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RowType<T> = T extends SheetSchema<infer R, any> ? R : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyType<T> = T extends SheetSchema<any, infer K> ? K : never;

export class Sheets<Schema extends ScheetsSchema> {
  private readonly auth: JWT;
  private readonly sheetsApi: sheets_v4.Sheets;
  private readonly tables: Schema;

  constructor(tables: Schema) {
    this.auth = new google.auth.JWT({
      email: env.CLIENT_EMAIL,
      key: env.PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheetsApi = google.sheets("v4");
    this.tables = tables;
  }

  table<Name extends keyof Schema>(
    name: Name,
  ): SheetTable<RowType<Schema[Name]>, KeyType<Schema[Name]>> {
    const converter = this.tables[name];
    if (!converter) {
      throw new Error(`Table ${name as string} not found`);
    }
    return new SheetTable(
      name as string,
      converter,
      this.sheetsApi,
      this.auth,
    ) as SheetTable<RowType<Schema[Name]>, KeyType<Schema[Name]>>;
  }
}

class SheetTable<Row, Key> {
  constructor(
    private readonly tableName: string,
    private readonly converter: SheetSchema<Row, Key>,
    private readonly sheetsApi: sheets_v4.Sheets,
    private readonly auth: JWT,
  ) {}

  async get(key: Key): Promise<Row | null> {
    console.log("get", key);
    const res = await this.sheetsApi.spreadsheets.values.get({
      spreadsheetId: env.SHEET_ID,
      auth: this.auth,
      range: this.tableName,
    });

    const values = res.data.values ?? [];
    console.log(values[1]);
    const rows = values
      .slice(1) // skip header row
      .map(this.converter.deserialize)
      .filter((row) => row !== null)
      .map((row) => {
        console.log(row);
        return row;
      });
    console.log(rows.length);
    return rows.find((row) => this.converter.getKey(row) === key) ?? null;
  }

  async set(rows: Row[]): Promise<void> {
    await this.sheetsApi.spreadsheets.values.update({
      spreadsheetId: env.SHEET_ID,
      auth: this.auth,
      range: this.tableName,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows.map(this.converter.serialize),
      },
    });
  }
}
