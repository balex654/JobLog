import React from "react";
import { HttpStorageService } from "./implementations/HttpStorageService";

export const StorageContext = React.createContext(HttpStorageService);