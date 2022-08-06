import * as locs from "mastercard-locations";
import * as places from "mastercard-places";
import * as crs from "cors"; 

export class Window {
  async fetch(req, env) {
    return {
      locs,
      places,
      crs
    }
  }
}
