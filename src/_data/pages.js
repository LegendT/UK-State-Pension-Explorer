// The page register as a list, for templates. The record to edit is pageRegister.json.
import { readFileSync } from "node:fs";

export default JSON.parse(readFileSync(new URL("./pageRegister.json", import.meta.url))).pages;
