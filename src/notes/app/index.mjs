export default (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Window = factory());
}(this, (function () {
    var MasterCardAPI$1 = require('mastercard-api-core');
    var locations = {};

    locations.MasterCardAPI = MasterCardAPI$1;
    locations.ATMCountries = require('./lib/ATMCountries');
    locations.ATMCountrySubdivisions = require('./lib/ATMCountrySubdivisions');
    locations.ATMLocations = require('./lib/ATMLocations');
    locations.MerchantCategories = require('./lib/MerchantCategories');
    locations.MerchantCountries = require('./lib/MerchantCountries');
    locations.MerchantCountrySubdivisions = require('./lib/MerchantCountrySubdivisions');
    locations.MerchantLocations = require('./lib/MerchantLocations');

    // SDK Config
    locations.ResourceConfig = require('./lib/resourceconfig');

    module.exports = locations;

    var locs = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    var MasterCardAPI = require('mastercard-api-core');
    var places = {};

    places.MasterCardAPI = MasterCardAPI;
    places.MerchantCategoryCodes = require('./lib/MerchantCategoryCodes');
    places.MerchantIndustries = require('./lib/MerchantIndustries');
    places.MerchantPointOfInterest = require('./lib/MerchantPointOfInterest');
    places.PlaceByLocationId = require('./lib/PlaceByLocationId');

    // SDK Config
    places.ResourceConfig = require('./lib/resourceconfig');

    module.exports = places;

    var places$1 = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    function Window() {
        return {
          locs,
          places: places$1
        }
    }

    return Window;

})))();
