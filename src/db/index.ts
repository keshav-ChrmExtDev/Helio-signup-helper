import Dexie, { EntityTable } from "dexie";

interface user_prefrences {
  id: number;
  auto_click_on_set_time_enabled: boolean;
}
interface alarm {
  id: number;
  time: string;
}
const db = new Dexie("helio_host_db") as Dexie & {
  user_prefrences: EntityTable<user_prefrences, "id">;
  alarms: EntityTable<alarm, "id">;
};

db.version(1).stores({
  user_prefrences: "++id, auto_click_on_set_time_enabled ",
  alarms: "++id, time",
});

db.user_prefrences.toArray().then((data) => {
  if (data.length === 0) {
    db.user_prefrences.add({ auto_click_on_set_time_enabled: true });
  }
});

export type { user_prefrences };
export type { user_prefrences, alarm };
export { db };
