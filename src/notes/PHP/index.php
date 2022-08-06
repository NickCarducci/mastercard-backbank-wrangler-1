<?php //traits? namespace defaultok; just comments in babel-preset-php
/*
 * Script-Name: mastercard-backbank for vaumoney
 */
//namespace locations\MasterCard\Api\Locations;//import namespace
//require_once('./vendor/autoload.php');
//declare(strict_types=1);
//bin stuff (callable from any folder, "global" if functions are files)
//use MasterCard\Core\Model\RequestMap;
//use MasterCard\Core\ApiConfig;
//use MasterCard\Core\Exception\ApiException;
//use MasterCard\Core\Security\OAuth\OAuthAuthentication;
//use oauth1signer\src\Developer\OAuth\Utils\AuthenticationUtils;

/**
 * Utility class.
 * @package Mastercard\Developer\OAuth\Utils
 */
class AuthenticationUtils {

    private function __construct() {
        // This class can't be instantiated
    }

    /**
     * Load a RSA signing key out of a PKCS#12 container.
     */
    public static function loadSigningKey($pkcs12KeyFilePath, $signingKeyAlias, $signingKeyPassword) { //NOSONAR
        try {
            $keystore = file_get_contents($pkcs12KeyFilePath);
        } catch (\Exception $e) {
            throw new \InvalidArgumentException('Failed to read the given file: ' . $pkcs12KeyFilePath, 0, $e);
        }

        openssl_pkcs12_read($keystore, $certs, $signingKeyPassword);
        if (is_null($certs)) {
            throw new \InvalidArgumentException('Failed to open keystore with the provided password!');
        }

        return openssl_get_privatekey($certs['pkey']);
    }
}


/**
 * Utility class.
 * @deprecated Use AuthenticationUtils instead.
 * @see Mastercard\Developer\OAuth\Utils\AuthenticationUtils
 * @package Mastercard\Developer\OAuth\Utils
*/
/*
class SecurityUtils {
    private function __construct() {This class can't be instantiated}
    /**
     * @deprecated
     *
    public static function loadPrivateKey($pkcs12KeyFilePath, $keyAlias, $keyPassword) {
        return AuthenticationUtils::loadSigningKey($pkcs12KeyFilePath, $keyAlias, $keyPassword);
    }
}*/

class OAuth {

    const AUTHORIZATION_HEADER_NAME = 'Authorization';

    /**
     * Creates a Mastercard API compliant OAuth Authorization header.
     * @return string
     * @throws \InvalidArgumentException
     */
    public static function getAuthorizationHeader($uri, $method, $payload, $consumerKey, $signingKey) {
        if (empty($uri)) {
            throw new \InvalidArgumentException('URI must be set!');
        }

        if (empty($method)) {
            throw new \InvalidArgumentException('HTTP method must be set!');
        }

        if (empty($consumerKey)) {
            throw new \InvalidArgumentException('Consumer key must be set!');
        }

        if (empty($signingKey)) {
            throw new \InvalidArgumentException('Signing key must be set!');
        }

        $queryParameters = self::extractQueryParams($uri);
        $oauthParameters = [];
        $oauthParameters['oauth_consumer_key'] = $consumerKey;
        $oauthParameters['oauth_nonce'] = self::getNonce();
        $oauthParameters['oauth_timestamp'] = self::getTimestamp();
        $oauthParameters['oauth_signature_method'] = 'RSA-SHA256';
        $oauthParameters['oauth_version'] = '1.0';
        $oauthParameters['oauth_body_hash'] = self::getBodyHash($payload);

        // Compute the OAuth signature
        $oauthParamString = self::getOAuthParamString($queryParameters, $oauthParameters);
        $baseUri = self::getBaseUriString($uri);
        $signatureBaseString = self::getSignatureBaseString($baseUri, $method, $oauthParamString);
        $oauthParameters['oauth_signature'] = self::signSignatureBaseString($signatureBaseString, $signingKey);

        // Constructs and returns a valid Authorization header as per https://tools.ietf.org/html/rfc5849#section-3.5.1
        $result = '';
        foreach ($oauthParameters as $key => $value) {
            $result .= (strlen($result) == 0 ? 'OAuth ' : ',');
            $result .=  $key . '="' . rawurlencode($value) . '"';
        }
        return $result;
    }

    /**
     * Parse query parameters out of the URL. https://tools.ietf.org/html/rfc5849#section-3.4.1.3
     * @return array
     * @throws \InvalidArgumentException
     */
    private static function extractQueryParams($uri) {
        $uriParts = parse_url($uri);
        if (!$uriParts) {
            throw new \InvalidArgumentException('URI is not valid!');
        }

        if (!array_key_exists('host', $uriParts)) {
            throw new \InvalidArgumentException('No URI host!');
        }

        if (!array_key_exists('query', $uriParts)) {
            return array();
        }

        $rawQueryString = $uriParts['query'];
        $decodedQueryString = rawurldecode($rawQueryString);
        $mustEncode = $decodedQueryString != $rawQueryString;

        $queryParameters = [];
        $rawParams = explode('&', $rawQueryString);
        foreach ($rawParams as $index => $pair) {
            if (empty($pair)) {
                continue;
            }
            $index = strpos($pair, '=');
            $key = rawurldecode($index > 0 ? substr($pair, 0, $index) : $pair);
            $value = ($index > 0 && strlen($pair) > $index + 1) ? rawurldecode(substr($pair, $index + 1)) : '';
            $encodedKey =  $mustEncode ? rawurlencode($key) : $key;
            $encodedValue = $mustEncode ? rawurlencode($value) : $value;
            if (!array_key_exists($encodedKey, $queryParameters)) {
                $queryParameters[$encodedKey] = array();
            }
            array_push($queryParameters[$encodedKey], $encodedValue);
        }

        return $queryParameters;
    }

    /**
     * Generates a hash based on request payload as per https://tools.ietf.org/id/draft-eaton-oauth-bodyhash-00.html.
     * "If the request does not have an entity body, the hash should be taken over the empty string".
     * @return string
     */
    private static function getBodyHash($payload) {
        return base64_encode(hash('sha256', $payload, true));
    }

    /**
     * Lexicographically sort all parameters and concatenate them into a string as per https://tools.ietf.org/html/rfc5849#section-3.4.1.3.2.
     * @return string
     */
    private static function getOAuthParamString($queryParameters, $oauthParameters) {
        foreach ($oauthParameters as $key => $value) {
            $oauthParameters[$key] = array($value);
        }
        $allParameters = array_merge($queryParameters, $oauthParameters);
        ksort($allParameters, SORT_NATURAL);

        // Build the OAuth parameter string
        $parameterString = '';
        foreach ($allParameters as $key => $values) {
            asort($values, SORT_NATURAL); // Keys with same name are sorted by their values
            foreach ($values as $value) {
                $parameterString .= (strlen($parameterString) == 0 ? '' : '&');
                $parameterString .=  $key . '=' . $value;
            }
        }
        return $parameterString;
    }

    /**
     * Normalizes the URL as per https://tools.ietf.org/html/rfc5849#section-3.4.1.2.
     * @return string
     * @throws \InvalidArgumentException
     */
    private static function getBaseUriString($uriString) {
        $uriParts = parse_url($uriString);
        if (!$uriParts) {
            throw new \InvalidArgumentException('URI is not valid!');
        }

        // Remove query and fragment
        $normalizedUrl = strtolower($uriParts['scheme']) . '://' . strtolower($uriParts['host']);

        if (array_key_exists('port', $uriParts)) {
            // Remove port if it matches the default for scheme
            $port = $uriParts['port'];
            if (!empty($port) && $port != 80 && $port != 443) {
                $normalizedUrl .= ':' . $port;
            }
        }

        $path = '';
        if (array_key_exists('path', $uriParts)) {
            $path = $uriParts['path'];
        }
        if (empty($path)) {
            $path = '/';
        }
        return $normalizedUrl . $path;
    }

    /**
     * Generate a valid signature base string as per https://tools.ietf.org/html/rfc5849#section-3.4.1.
     * @return string
     */
    private static function getSignatureBaseString($baseUri, $httpMethod, $oauthParamString) {
        return strtoupper($httpMethod)                   // Uppercase HTTP method
              . '&' . rawurlencode($baseUri)            // Base URI
              . '&' . rawurlencode($oauthParamString);  // OAuth parameter string
    }

    /**
     * Signs the signature base string using an RSA private key. The methodology is described at
     * https://tools.ietf.org/html/rfc5849#section-3.4.3 but Mastercard uses the stronger SHA-256 algorithm
     * as a replacement for the described SHA1 which is no longer considered secure.
     * @return string
     */
    private static function signSignatureBaseString($baseString, $privateKey) {
        openssl_sign($baseString, $signature, $privateKey, "SHA256");
        return base64_encode($signature);
    }

    /**
     * Generates a random string for replay protection as per https://tools.ietf.org/html/rfc5849#section-3.3.
     * @return string
     */
    private static function getNonce($length = 16) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    /**
     * Returns UNIX Timestamp as required per https://tools.ietf.org/html/rfc5849#section-3.3.
     * @return int
     */
    private static function getTimestamp() {
        return time();
    }
}
//use oauth1signer\src\Developer\OAuth\OAuth;
//use oauth1signer\src\Developer\Signers\CurlRequestSigner;
abstract class BaseSigner {

    protected $consumerKey;
    protected $signingKey;

    public function __construct($consumerKey, $signingKey) {
        $this->consumerKey = $consumerKey;
        $this->signingKey = $signingKey;
    }
}

/**
 * Utility class for adding the authorization header to cURL requests (see: http://php.net/manual/en/book.curl.php)
 */
class CurlRequestSigner extends BaseSigner {

    public function sign(&$handle, $method, &$headers = array(), $payload = null) {
        $uri = curl_getinfo($handle, CURLINFO_EFFECTIVE_URL);
        $authHeader = OAuth::getAuthorizationHeader($uri, $method, $payload, $this->consumerKey, $this->signingKey);
        $headers[] = OAuth::AUTHORIZATION_HEADER_NAME . ': ' . $authHeader;
        curl_setopt($handle, CURLOPT_HTTPHEADER, $headers);
    }
}

function initializeMCard($locations) {
    /*$password = '...';
    $results = array();
    $worked = openssl_pkcs12_read(secrets.MASTERCARD_P12_BINARY, $results, $password));
    //openssl_pkcs12_read(file_get_contents($filename), $results, $password));
    if($worked) {
        echo '<pre>', print_r($results, true), '</pre>';
    } else {
        echo openssl_error_string();
    }*/
    $consumerKey = secrets.MASTERCARD_CONSUMER_KEY;   // You should copy this from "My Keys" on your project page 
    //e.g. UTfbhDCSeNYvJpLL5l028sWL9it739PYh6LU5lZja15xcRpY!fd209e6c579dc9d7be52da93d35ae6b6c167c174690b72fa
    $keyAlias = "keyalias";   // For production: change this to the key alias you chose when you created 
    //your production key
    $keyPassword = "keystorepassword";   // For production: change this to the key alias you chose when you created 
    //your production key
    $privateKeyFileContent = file_get_contents(getcwd()[secrets.MASTERCARD_P12_BINARY]); 
    // e.g. /Users/yourname/project/sandbox.p12 | C:\Users\yourname\project\sandbox.p12
    if ($privateKeyFileContent === false) {
        // TODO: file not found
        return null;
    }
    if($locations){
        //ApiConfig::setAuthentication(new OAuthAuthentication($consumerKey, $privateKeyFileContent, $keyAlias, $keyPassword));
        //ApiConfig::setDebug(true); // Enable http wire logging
        //ApiConfig::setSandbox(true);   // For production: use ApiConfig::setSandbox(false)
    } else {//CurlRequestSigner
       return AuthenticationUtils::loadSigningKey($privateKeyFileContent,$keyAlias,$keyPassword);
    }
}

function mastercardRoute ($req, $func) {
    function cb ($error, $data) {return $error ? $error : $data; };
    $response = null;
    $signingKey = initializeMCard();
        
    /*$consumerKey = '<insert consumer key>';
    $uri = 'https://sandbox.api.mastercard.com/service';
    $method = 'POST';
    $payload = 'Hello world!';
    $authHeader = OAuth::getAuthorizationHeader($uri, $method, $payload, $consumerKey, $signingKey);*/
    $method = 'POST';
    $base_uri = 'https://sandbox.api.mastercard.com/';
    $payload = json_encode(['foo' => 'bår']);
    $headers = array(
        'Content-Type: application/json',
        'Content-Length: ' . strlen($payload)
    );

    function setmap($object,$key) {
        return $key = $object[$key];
    }
        
    if ($func === "getAtms") {
        initializeMCard(true);
        /*$map = new RequestMap();
        $map->setmap($req.body,"PageOffset");
        $map->setmap($req.body,"PageLength");
        $map->setmap($req.body,"PostalCode");
        $input = ATMLocations::query($map);*/
        $q = [
            'pageOffset' => $req.body.PageOffset,
            'pageLength' => $req.body.PageLength,
            'postalCode' => $req.body.PostalCode,
        ];
        /*class Atmlocator {
            public $PageOffset;//querywideoffset;
            public $TotalCount;//totalsofar
            public $atms;
        }*/
        /*Location.Name
        Location.Distance
        Location.DistanceUnit
        Location.Address.Line1
        Location.Address.Line2
        Location.Address.City
        Location.Address.PostalCode
        Location.Address.CountrySubdivision.Name
        Location.Address.CountrySubdivision.Code
        Location.Address.Country.Name
        Location.Address.Country.Code
        Location.Point.Latitude
        Location.Point.Longitude
        Location.LocationType.Type
        HandicapAccessible
        Camera,Availability,AccessFees
        Owner,SharedDeposit,SurchargeFreeAlliance
        SurchargeFreeAllianceNetwork
        Sponsor,SupportEMV
        InternationalMaestroAccepted*/
    
        $response = unserialize(
            stream_get_contents(
                fopen(
                    sprintf(
                        '%s/rest/?%s',
                        $base_uri+'atms/v1/atm',//?limit=25',
                        http_build_query($q/* + ['limit' => 25]*/)
                    ), 'r'
                )
            )
        );
        /*class TheAtms {
            public 
        }
        $response = new TheAtms();
        $response->$PageOffset = $input.PageOffset;
        $response->$TotalCount = $input.TotalCount;
        $response->$atms = $input.Atms;*/
    } else if ($func === "getMerchants") {
        $distance = $req.body; //query
        class Place {
            public $countryCode;
            public $latitude;
            public $longitude;
        }
        $place = new Place();
        $place->countryCode = $req.body.countryCode;
        $place->latitude = $req.body.latitude;
        $place->longitude = $req.body.longitude;
        $q = [
            'pageOffset' => 0,
            'pageLength' => 10,
            'radiusSearch' => "true",
            'unit' => "km",
            'distance' => $distance,
            'place' => $place
        ];
        /*$handle = curl_init($base_uri + 'location-intelligence/places-locator');
        curl_setopt_array($handle, array(CURLOPT_RETURNTRANSFER => 1, CURLOPT_CUSTOMREQUEST => $method, CURLOPT_POSTFIELDS => $payload));
        $signer = new CurlRequestSigner($consumerKey, $signingKey);
        $signer->sign($handle, $method, $headers, $payload);
        $result = curl_exec($handle);
        curl_close($handle);*/


        $response = unserialize(
                        stream_get_contents(
                            fopen(
                                sprintf(
                                    '%s/rest/?%s',
                                    $base_uri+'location-intelligence/places-locator/'+'places/searches',//?limit=25',
                                    http_build_query($q + ['limit' => 25])
                                ), 'r'
                            )
                        )
                    );
        //$response = await places.MerchantPointOfInterest.create($q, $cb);
    } else if ($func === "getCategories") {
        $response = unserialize(
                        stream_get_contents(
                            fopen(
                                sprintf(
                                    '%s/rest/?%s',
                                    $base_uri+'location-intelligence/places-locator/'+'merchant-category-codes',//?limit=25',
                                    http_build_query(['limit' => 25,])
                                ), 'r'
                            )
                        )
                    );
        //$response = await places.MerchantCategoryCodes.query({}, $cb);
    } else if ($func === "getIndustries") {
        $response = unserialize(
                        stream_get_contents(
                            fopen(
                                sprintf(
                                    '%s/rest/?%s',
                                    $base_uri+'location-intelligence/places-locator/'+'merchant-industry-codes',//?limit=25',
                                    http_build_query(['limit' => 25,])
                                ), 'r'
                            )
                        )
                    );
        //$response = await places.MerchantIndustries.query({}, $cb);
    }
    
    return $response;
};


/*addEventListener("fetch", function ($event) {
    $event->respondWith(handleRequest($event->request));
});
function handleRequest($request) {
    $PHPWorkerHelloWorld = null;
    if ($request.url === "/deposit") {
        $PHPWorkerHelloWorld = mastercardRoute($request, "getAtms");
    } else if ($request.url === "/choose_category") {
        $PHPWorkerHelloWorld = mastercardRoute($request, "getCategories");
    } else if ($request.url === "/choose_industry") {
        $PHPWorkerHelloWorld = mastercardRoute($request, "getIndustries");
    } else if ($request.url === "/merchants") {
        $PHPWorkerHelloWorld = mastercardRoute($request, "getMerchants");
    }
    /*return new Response(`{ok: true,data: ${r} }`);*
    return new Response($PHPWorkerHelloWorld, [
        "headers" => [ "content-type" => "text/plain" ]
    ]);
}*/
class Mgillicuddy {
    public $AuthenticationUtils = AuthenticationUtils;
    public $OAuth = OAuth;
    public $mastercardRoute = mastercardRoute;
    //return  static function () {}
};
//return new Mgillicuddy;
//define('DEFAULT',new Mgillicuddy);
//console var_dump(constant('DEFAULT'));
error_reporting(E_ALL);

require_once 'XML/Serializer.php';

$index = new stdClass();
$index->error = PEAR::raiseError('error',123);
$index->app = new Mgillicuddy;//require_once 'sxml_index.php';//new Index();

$serializer = new XML_Serializer(array(
    XML_SERIALIZER_OPTION_INDENT      => '    ',
    XML_SERIALIZER_OPTION_LINEBREAKS  => "\n",
    XML_SERIALIZER_OPTION_DEFAULT_TAG => 'unnamedItem',
    XML_SERIALIZER_OPTION_TYPEHINTS   => true
  ));

if($serializer-> serialize($index)) 
    $xml = $serializer-> getSerializedData();

echo '<pre>';
echo htmlspecialchars($xml);
echo '</pre>';
