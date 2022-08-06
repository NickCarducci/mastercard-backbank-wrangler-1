//"await will ensure all necessary memory barriers are in place. However, that doesn't make them 'thread-safe'."
//https://stackoverflow.com/questions/53649448/is-it-needed-to-make-fields-thread-safe-when-using-async-await

//https://www.npmjs.com/package/phpjs
//no async for `sprintf` datbase call.
//synchronous
//https://github.com/spatie/async is optional to take advantage of threat pools in parallel (concurrent is sync in code)

//https://github.com/cloudflare/workers-rs#faq
//All crates in your Worker project must compile to wasm32-unknown-unknown target,
//which is more limited in some ways than targets for x86 and ARM64.
//async

<?php

class AuthenticationUtils {
    private function __construct() {/*This class can't be instantiated*/}
    
    // Load a RSA signing key out of a PKCS#12 container.
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
    
    $consumerKey = secrets.MASTERCARD_CONSUMER_KEY;
    
    $keyAlias = "keyalias";   // For production: your production key
    $keyPassword = "keystorepassword";   // For production: your production key
    
    $privateKeyFileContent = file_get_contents(getcwd()[secrets.MASTERCARD_P12_BINARY]); 
    // e.g. /Users/yourname/project/sandbox.p12 | C:\Users\yourname\project\sandbox.p12
    if ($privateKeyFileContent === false) {
        return null;
    }
    if($locations){
        
    } else {//CurlRequestSigner
       return AuthenticationUtils::loadSigningKey($privateKeyFileContent,$keyAlias,$keyPassword);
    }
}

function mastercardRoute ($req, $func) {
    function cb ($error, $data) {return $error ? $error : $data; };
    $response = null;
    $signingKey = initializeMCard();
        
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
        
        $q = [
            'pageOffset' => $req.body.PageOffset,
            'pageLength' => $req.body.PageLength,
            'postalCode' => $req.body.PostalCode,
        ];
        
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
    } else if ($func === "getIndustries") {
        $response = unserialize(
            //stream_get_contents is for a stream started by a sprintf that has not been a file_get_contents that hasn't been able to curl
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
    }
    
    return $response;
};

class Mgillicuddy {
    public $AuthenticationUtils = AuthenticationUtils;
    public $OAuth = OAuth;
    public $mastercardRoute = mastercardRoute;
    //return  static function () {}
};

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
