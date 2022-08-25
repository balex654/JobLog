import React from "react";
import { HttpStorageService } from "./HttpStorageService";

export const StorageContext = React.createContext(HttpStorageService);