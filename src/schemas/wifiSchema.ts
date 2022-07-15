import joi from "joi";
import { CreateWifiData } from "../repositories/wifiRepository.js";

export const wifiSchema = joi.object<CreateWifiData>({
  name: joi.string().required(),
  password: joi.string().required(),
  title: joi.string().required(),
});
