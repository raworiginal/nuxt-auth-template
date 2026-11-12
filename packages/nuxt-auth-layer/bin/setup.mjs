#!/usr/bin/env node
import { tsImport } from "tsx/esm/api";

await tsImport("../scripts/setup.ts", import.meta.url);
