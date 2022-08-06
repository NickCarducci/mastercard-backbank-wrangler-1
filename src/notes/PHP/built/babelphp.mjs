//traits? namespace defaultok; just comments in babel-preset-php
// Script-Name: mastercard-backbank for vaumoney
//namespace locations\MasterCard\Api\Locations;//import namespace
//require_once('./vendor/autoload.php');
//declare(strict_types=1);
//bin stuff (callable from any folder, "global" if functions are files)
//use MasterCard\Core\Model\RequestMap;
//use MasterCard\Core\ApiConfig;
//use MasterCard\Core\Exception\ApiException;
//use MasterCard\Core\Security\OAuth\OAuthAuthentication;
//use oauth1signer\src\Developer\OAuth\Utils\AuthenticationUtils;
//
//Utility class.
//@package Mastercard\Developer\OAuth\Utils
//
//
//Utility class.
//@deprecated Use AuthenticationUtils instead.
//@see Mastercard\Developer\OAuth\Utils\AuthenticationUtils
//@package Mastercard\Developer\OAuth\Utils
//class SecurityUtils {
//    private function __construct() {This class can't be instantiated}
//    /**
// @deprecated
//
//    public static function loadPrivateKey($pkcs12KeyFilePath, $keyAlias, $keyPassword) {
//        return AuthenticationUtils::loadSigningKey($pkcs12KeyFilePath, $keyAlias, $keyPassword);
//    }
//}
//use oauth1signer\src\Developer\OAuth\OAuth;
//use oauth1signer\src\Developer\Signers\CurlRequestSigner;
//
//Utility class for adding the authorization header to cURL requests (see: http://php.net/manual/en/book.curl.php)
//
//define('DEFAULT',new Mgillicuddy);
//console var_dump(constant('DEFAULT'));

//
//Load a RSA signing key out of a PKCS#12 container.
//
class AuthenticationUtils {
  constructor() //This class can't be instantiated
  {}

  static loadSigningKey(pkcs12KeyFilePath, signingKeyAlias, signingKeyPassword) //NOSONAR
  {
    try {
      var keystore = file_get_contents(pkcs12KeyFilePath);
    } catch (e) {
      throw new global.InvalidArgumentException("Failed to read the given file: " + pkcs12KeyFilePath, 0, e);
    }

    openssl_pkcs12_read(keystore, certs, signingKeyPassword);

    if (is_null(certs)) {
      throw new global.InvalidArgumentException("Failed to open keystore with the provided password!");
    }

    return openssl_get_privatekey(certs.pkey);
  }

};

//
//Creates a Mastercard API compliant OAuth Authorization header.
//@return string
//@throws \InvalidArgumentException
//
//
//Parse query parameters out of the URL. https://tools.ietf.org/html/rfc5849#section-3.4.1.3
//@return array
//@throws \InvalidArgumentException
//
//
//Generates a hash based on request payload as per https://tools.ietf.org/id/draft-eaton-oauth-bodyhash-00.html.
//"If the request does not have an entity body, the hash should be taken over the empty string".
//@return string
//
//
//Lexicographically sort all parameters and concatenate them into a string as per https://tools.ietf.org/html/rfc5849#section-3.4.1.3.2.
//@return string
//
//
//Normalizes the URL as per https://tools.ietf.org/html/rfc5849#section-3.4.1.2.
//@return string
//@throws \InvalidArgumentException
//
//
//Generate a valid signature base string as per https://tools.ietf.org/html/rfc5849#section-3.4.1.
//@return string
//
//
//Signs the signature base string using an RSA private key. The methodology is described at
//https://tools.ietf.org/html/rfc5849#section-3.4.3 but Mastercard uses the stronger SHA-256 algorithm
//as a replacement for the described SHA1 which is no longer considered secure.
//@return string
//
//
//Generates a random string for replay protection as per https://tools.ietf.org/html/rfc5849#section-3.3.
//@return string
//
//
//Returns UNIX Timestamp as required per https://tools.ietf.org/html/rfc5849#section-3.3.
//@return int
//
class OAuth {
  static AUTHORIZATION_HEADER_NAME = "Authorization";

  static getAuthorizationHeader(uri, method, payload, consumerKey, signingKey) //Compute the OAuth signature
  //Constructs and returns a valid Authorization header as per https://tools.ietf.org/html/rfc5849#section-3.5.1
  {
    if (!uri) {
      throw new global.InvalidArgumentException("URI must be set!");
    }

    if (!method) {
      throw new global.InvalidArgumentException("HTTP method must be set!");
    }

    if (!consumerKey) {
      throw new global.InvalidArgumentException("Consumer key must be set!");
    }

    if (!signingKey) {
      throw new global.InvalidArgumentException("Signing key must be set!");
    }

    var queryParameters = OAuth.extractQueryParams(uri);
    var oauthParameters = Array();
    oauthParameters.oauth_consumer_key = consumerKey;
    oauthParameters.oauth_nonce = OAuth.getNonce();
    oauthParameters.oauth_timestamp = OAuth.getTimestamp();
    oauthParameters.oauth_signature_method = "RSA-SHA256";
    oauthParameters.oauth_version = "1.0";
    oauthParameters.oauth_body_hash = OAuth.getBodyHash(payload);
    var oauthParamString = OAuth.getOAuthParamString(queryParameters, oauthParameters);
    var baseUri = OAuth.getBaseUriString(uri);
    var signatureBaseString = OAuth.getSignatureBaseString(baseUri, method, oauthParamString);
    oauthParameters.oauth_signature = OAuth.signSignatureBaseString(signatureBaseString, signingKey);
    var result = "";

    for (var key in oauthParameters) {
      var value = oauthParameters[key];
      result += result.length == 0 ? "OAuth " : ",";
      result += key + "=\"" + encodeURIComponent(value) + "\"";
    }

    return result;
  }

  static extractQueryParams(uri) {
    var uriParts = parse_url(uri);

    if (!uriParts) {
      throw new global.InvalidArgumentException("URI is not valid!");
    }

    if (!("host" in uriParts)) {
      throw new global.InvalidArgumentException("No URI host!");
    }

    if (!("query" in uriParts)) {
      return Array();
    }

    var rawQueryString = uriParts.query;
    var decodedQueryString = rawurldecode(rawQueryString);
    var mustEncode = decodedQueryString != rawQueryString;
    var queryParameters = Array();
    var rawParams = rawQueryString.split("&");

    for (var index in rawParams) {
      var pair = rawParams[index];

      if (!pair) {
        continue;
      }

      var index = strpos(pair, "=");
      var key = rawurldecode(index > 0 ? pair.substr(0, index) : pair);
      var value = index > 0 && pair.length > index + 1 ? rawurldecode(pair.substr(index + 1)) : "";
      var encodedKey = mustEncode ? encodeURIComponent(key) : key;
      var encodedValue = mustEncode ? encodeURIComponent(value) : value;

      if (!(encodedKey in queryParameters)) {
        queryParameters[encodedKey] = Array();
      }

      queryParameters[encodedKey].push(encodedValue);
    }

    return queryParameters;
  }

  static getBodyHash(payload) {
    return base64_encode(hash("sha256", payload, true));
  }

  static getOAuthParamString(queryParameters, oauthParameters) //Build the OAuth parameter string
  {
    for (var key in oauthParameters) {
      var value = oauthParameters[key];
      oauthParameters[key] = [value];
    }

    var allParameters = array_merge(queryParameters, oauthParameters);
    ksort(allParameters, SORT_NATURAL);
    var parameterString = "";

    for (var key in allParameters) //Keys with same name are sorted by their values
    {
      var values = allParameters[key];
      asort(values, SORT_NATURAL);

      for (var value of Object.values(values)) {
        parameterString += parameterString.length == 0 ? "" : "&";
        parameterString += key + "=" + value;
      }
    }

    return parameterString;
  }

  static getBaseUriString(uriString) {
    var uriParts = parse_url(uriString);

    if (!uriParts) {
      throw new global.InvalidArgumentException("URI is not valid!");
    }

    var normalizedUrl = uriParts.scheme.toLowerCase() + "://" + uriParts.host.toLowerCase();

    if ("port" in uriParts) //Remove port if it matches the default for scheme
      {
        var port = uriParts.port;

        if (!!port && port != 80 && port != 443) {
          normalizedUrl += ":" + port;
        }
      }

    var path = "";

    if ("path" in uriParts) {
      path = uriParts.path;
    }

    if (!path) {
      path = "/";
    }

    return normalizedUrl + path;
  }

  static getSignatureBaseString(baseUri, httpMethod, oauthParamString) //OAuth parameter string
  {
    return httpMethod.toUpperCase() + "&" + encodeURIComponent(baseUri) + "&" + encodeURIComponent(oauthParamString);
  }

  static signSignatureBaseString(baseString, privateKey) {
    openssl_sign(baseString, signature, privateKey, "SHA256");
    return base64_encode(signature);
  }

  static getNonce(length = 16) {
    var characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charactersLength = characters.length;
    var randomString = "";

    for (var i = 0; i < length; i++) {
      randomString += characters[rand(0, charactersLength - 1)];
    }

    return randomString;
  }

  static getTimestamp() {
    return Date.now() / 1000;
  }

};

class BaseSigner {
  constructor(consumerKey, signingKey) {
    this.consumerKey = consumerKey;
    this.signingKey = signingKey;
  }

};

class CurlRequestSigner extends BaseSigner {
  sign(handle, method, headers = Array(), payload = undefined) {
    var uri = curl_getinfo(handle, CURLINFO_EFFECTIVE_URL);
    var authHeader = OAuth.getAuthorizationHeader(uri, method, payload, this.consumerKey, this.signingKey);
    headers.push(OAuth.AUTHORIZATION_HEADER_NAME + ": " + authHeader);
    curl_setopt(handle, CURLOPT_HTTPHEADER, headers);
  }

};

function initializeMCard(locations) //$password = '...';
//    $results = array();
//    $worked = openssl_pkcs12_read(secrets.MASTERCARD_P12_BINARY, $results, $password));
//    //openssl_pkcs12_read(file_get_contents($filename), $results, $password));
//    if($worked) {
//        echo '<pre>', print_r($results, true), '</pre>';
//    } else {
//        echo openssl_error_string();
//    }
//You should copy this from "My Keys" on your project page
//e.g. UTfbhDCSeNYvJpLL5l028sWL9it739PYh6LU5lZja15xcRpY!fd209e6c579dc9d7be52da93d35ae6b6c167c174690b72fa
//For production: change this to the key alias you chose when you created
//your production key
//For production: change this to the key alias you chose when you created
//your production key
//e.g. /Users/yourname/project/sandbox.p12 | C:\Users\yourname\project\sandbox.p12
{
  var consumerKey = secrets + MASTERCARD_CONSUMER_KEY;
  var keyAlias = "keyalias";
  var keyPassword = "keystorepassword";
  var privateKeyFileContent = file_get_contents(getcwd()[secrets + MASTERCARD_P12_BINARY]);

  if (privateKeyFileContent === false) //TODO: file not found
    {
      return undefined;
    }

  if (locations) //ApiConfig::setAuthentication(new OAuthAuthentication($consumerKey, $privateKeyFileContent, $keyAlias, $keyPassword));
    //ApiConfig::setDebug(true); // Enable http wire logging
    //ApiConfig::setSandbox(true);   // For production: use ApiConfig::setSandbox(false)
    {} else //CurlRequestSigner
    {
      return AuthenticationUtils.loadSigningKey(privateKeyFileContent, keyAlias, keyPassword);
    }
};

function mastercardRoute(req, func) //$consumerKey = '<insert consumer key>';
//    $uri = 'https://sandbox.api.mastercard.com/service';
//    $method = 'POST';
//    $payload = 'Hello world!';
//    $authHeader = OAuth::getAuthorizationHeader($uri, $method, $payload, $consumerKey, $signingKey);
{
  function cb(error, data) {
    return error ? error : data;
  };

  var response = undefined;
  var signingKey = initializeMCard();
  var method = "POST";
  var base_uri = "https://sandbox.api.mastercard.com/";
  var payload = JSON.stringify({
    foo: "b\xE5r"
  });
  var headers = ["Content-Type: application/json", "Content-Length: " + payload.length];

  function setmap(object, key) {
    return key = object[key];
  };

  if (func === "getAtms") //$map = new RequestMap();
    //        $map->setmap($req.body,"PageOffset");
    //        $map->setmap($req.body,"PageLength");
    //        $map->setmap($req.body,"PostalCode");
    //        $input = ATMLocations::query($map);
    //class Atmlocator {
    //            public $PageOffset;//querywideoffset;
    //            public $TotalCount;//totalsofar
    //            public $atms;
    //        }
    //Location.Name
    //        Location.Distance
    //        Location.DistanceUnit
    //        Location.Address.Line1
    //        Location.Address.Line2
    //        Location.Address.City
    //        Location.Address.PostalCode
    //        Location.Address.CountrySubdivision.Name
    //        Location.Address.CountrySubdivision.Code
    //        Location.Address.Country.Name
    //        Location.Address.Country.Code
    //        Location.Point.Latitude
    //        Location.Point.Longitude
    //        Location.LocationType.Type
    //        HandicapAccessible
    //        Camera,Availability,AccessFees
    //        Owner,SharedDeposit,SurchargeFreeAlliance
    //        SurchargeFreeAllianceNetwork
    //        Sponsor,SupportEMV
    //        InternationalMaestroAccepted
    //class TheAtms {
    //            public 
    //        }
    //        $response = new TheAtms();
    //        $response->$PageOffset = $input.PageOffset;
    //        $response->$TotalCount = $input.TotalCount;
    //        $response->$atms = $input.Atms;
    {
      initializeMCard(true);
      var q = {
        pageOffset: req + body + PageOffset,
        pageLength: req + body + PageLength,
        postalCode: req + body + PostalCode
      };
      response = unserialize(stream_get_contents(fopen(sprintf("%s/rest/?%s", base_uri + "atms/v1/atm", http_build_query(q)), "r")));
    } else if (func === "getMerchants") //query
    //$handle = curl_init($base_uri + 'location-intelligence/places-locator');
    //        curl_setopt_array($handle, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_POSTFIELDS => $payload));
    //        $signer = new CurlRequestSigner($consumerKey, $signingKey);
    //        $signer->sign($handle, $method, $headers, $payload);
    //        $result = curl_exec($handle);
    //        curl_close($handle);
    //$response = await places.MerchantPointOfInterest.create($q, $cb);
    {
      var distance = req + body;

      class Place {};

      var place = new Place();
      place.countryCode = req + body + countryCode;
      place.latitude = req + body + latitude;
      place.longitude = req + body + longitude;
      q = {
        pageOffset: 0,
        pageLength: 10,
        radiusSearch: "true",
        unit: "km",
        distance: distance,
        place: place
      };
      response = unserialize(stream_get_contents(fopen(sprintf("%s/rest/?%s", base_uri + "location-intelligence/places-locator/" + "places/searches", http_build_query(q + {
        limit: 25
      })), "r")));
    } else if (func === "getCategories") //$response = await places.MerchantCategoryCodes.query({}, $cb);
    {
      response = unserialize(stream_get_contents(fopen(sprintf("%s/rest/?%s", base_uri + "location-intelligence/places-locator/" + "merchant-category-codes", http_build_query({
        limit: 25
      })), "r")));
    } else if (func === "getIndustries") //$response = await places.MerchantIndustries.query({}, $cb);
    {
      response = unserialize(stream_get_contents(fopen(sprintf("%s/rest/?%s", base_uri + "location-intelligence/places-locator/" + "merchant-industry-codes", http_build_query({
        limit: 25
      })), "r")));
    }

  return response;
};

//return  static function () {}
class Mgillicuddy {
  constructor() {
    this.AuthenticationUtils = AuthenticationUtils;
    this.OAuth = OAuth;
    return mastercardRoute;
  }

};

export default new Mgillicuddy();
