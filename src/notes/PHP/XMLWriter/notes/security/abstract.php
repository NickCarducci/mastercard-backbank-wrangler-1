<?php

//namespace Mastercard\XmlRpc;//autoload composer.json
namespace Backbank\;

use DateTime;
use Exception;
use Laminas\XmlRpc\Exception\InvalidArgumentException;
use Laminas\XmlRpc\Exception\ValueException;
use Laminas\XmlRpc\Generator\GeneratorInterface;
use SimpleXMLElement;

use function array_keys;
use function count;
use function extension_loaded;
use function get_object_vars;
use function gettype;
use function is_array;
use function is_bool;
use function is_float;
use function is_int;
use function is_object;
use function is_string;
use function preg_match;
use function range;
use function sprintf;
use function str_replace;

use const PHP_INT_MAX;
use const PHP_INT_SIZE;

//PHP var's, XML string, or XML-RPC native
abstract class AbstractValue
{
    //method-parameters
    protected $value;

    //a XMLRPC_TYPE_* constant XML-RPC native 
    protected $type;

    protected $xml;

    // BigInteger, XMLRPC i8 types?
    // phpcs:ignore
    public static $USE_BIGINT_FOR_I8 = PHP_INT_SIZE < 8;

    /** @var GeneratorInterface */
    protected static $generator;
    public const AUTO_DETECT_TYPE = 'auto_detect';//XML-RPC native type
    public const XML_STRING = 'xml';// XML-RPC parse

    public const XMLRPC_TYPE_I4        = 'i4';
    public const XMLRPC_TYPE_INTEGER   = 'int';
    public const XMLRPC_TYPE_I8        = 'i8';
    public const XMLRPC_TYPE_APACHEI8  = 'ex:i8';
    public const XMLRPC_TYPE_DOUBLE    = 'double';
    public const XMLRPC_TYPE_BOOLEAN   = 'boolean';
    public const XMLRPC_TYPE_STRING    = 'string';
    public const XMLRPC_TYPE_DATETIME  = 'dateTime.iso8601';
    public const XMLRPC_TYPE_BASE64    = 'base64';
    public const XMLRPC_TYPE_ARRAY     = 'array';
    public const XMLRPC_TYPE_STRUCT    = 'struct';
    public const XMLRPC_TYPE_NIL       = 'nil';
    public const XMLRPC_TYPE_APACHENIL = 'ex:nil';

    public function getType()
    {
        return $this->type;
    }

    public static function getGenerator()
    {
        if (! static::$generator) {
            if (extension_loaded('xmlwriter')) {
                static::$generator = new Generator\XmlWriter();
            } else {
                static::$generator = new Generator\DomDocument();
            }
        }

        return static::$generator;
    }

    public static function setGenerator(?Generator\GeneratorInterface $generator = null)
    {
        static::$generator = $generator;
    }

    public static function setEncoding($encoding)
    {
        $generator    = static::getGenerator();
        $newGenerator = new $generator($encoding);
        static::setGenerator($newGenerator);
    }

    abstract public function getValue();//PHP->XML-RPC

    public function saveXml()
    {
        if (! $this->xml) {
            $this->generateXml();
            $this->xml = (string) static::getGenerator();
        }
        return $this->xml;//XML->MXL-RPC
    }

    public function generateXml()
    {
        $this->generate();//XML/RPC
    }

    /**
     Creates a Value* object, representing a native XML-RPC value
     A XmlRpcValue object can be created in 3 ways:
     1. native type -> PHP type (default)
     2. $type is a Value::XMLRPC_TYPE_* constant
     3. From a XML string
     
     XML * operations
     $libXmlOptions(bitmask of LIBXML options) parameter (i.e. LIBXML_PARSEHUGE)
     See https://www.php.net/manual/en/libxml.constants.php
    */
    public static function getXmlRpcValue($value, $type = self::AUTO_DETECT_TYPE, int $libXmlOptions = 0)
    {
        switch ($type) {
            case self::AUTO_DETECT_TYPE:
                // Auto detect the XML-RPC native type from the PHP type of $value
                return static::phpVarToNativeXmlRpc($value);

            case self::XML_STRING:
                // Parse the XML string given in $value and get the XML-RPC value in it
                return static::xmlStringToNativeXmlRpc($value, $libXmlOptions);

            case self::XMLRPC_TYPE_I4:
                // fall through to the next case
            case self::XMLRPC_TYPE_INTEGER:
                return new Value\Integer($value);

            case self::XMLRPC_TYPE_I8:
                // fall through to the next case
            case self::XMLRPC_TYPE_APACHEI8:
                return self::$USE_BIGINT_FOR_I8 ? new Value\BigInteger($value) : new Value\Integer($value);

            case self::XMLRPC_TYPE_DOUBLE:
                return new Value\Double($value);

            case self::XMLRPC_TYPE_BOOLEAN:
                return new Value\Boolean($value);

            case self::XMLRPC_TYPE_STRING:
                return new Value\Text($value);

            case self::XMLRPC_TYPE_BASE64:
                return new Value\Base64($value);

            case self::XMLRPC_TYPE_NIL:
                // fall through to the next case
            case self::XMLRPC_TYPE_APACHENIL:
                return new Value\Nil();

            case self::XMLRPC_TYPE_DATETIME:
                return new Value\DateTime($value);

            case self::XMLRPC_TYPE_ARRAY:
                return new Value\ArrayValue($value);

            case self::XMLRPC_TYPE_STRUCT:
                return new Value\Struct($value);

            default:
                throw new ValueException('Given type is not a ' . self::class . ' constant');
        }
    }

    // XML-RPC type-> PHP type
    public static function getXmlRpcTypeByValue($value)
    {
        if (is_object($value)) {
            if ($value instanceof AbstractValue) {
                return $value->getType();
            } elseif ($value instanceof DateTime) {
                return self::XMLRPC_TYPE_DATETIME;
            }
            return static::getXmlRpcTypeByValue(get_object_vars($value));
        } elseif (is_array($value)) {
            if (! empty($value) && is_array($value) && (array_keys($value) !== range(0, count($value) - 1))) {
                return self::XMLRPC_TYPE_STRUCT;
            }
            return self::XMLRPC_TYPE_ARRAY;
        } elseif (is_int($value)) {
            return $value > PHP_INT_MAX ? self::XMLRPC_TYPE_I8 : self::XMLRPC_TYPE_INTEGER;
        } elseif (is_float($value)) {
            return self::XMLRPC_TYPE_DOUBLE;
        } elseif (is_bool($value)) {
            return self::XMLRPC_TYPE_BOOLEAN;
        } elseif (null === $value) {
            return self::XMLRPC_TYPE_NIL;
        } elseif (is_string($value)) {
            return self::XMLRPC_TYPE_STRING;
        }
        throw new InvalidArgumentException(sprintf(
            'No matching XMLRPC type found for php type %s.',
            gettype($value)
        ));
    }

    // XML-RPC-> PHP
    protected static function phpVarToNativeXmlRpc($value)
    {
        // @see https://getlaminas.org/issues/browse/Laminas-8623
        if ($value instanceof AbstractValue) {
            return $value;
        }

        switch (static::getXmlRpcTypeByValue($value)) {
            case self::XMLRPC_TYPE_DATETIME:
                return new Value\DateTime($value);

            case self::XMLRPC_TYPE_ARRAY:
                return new Value\ArrayValue($value);

            case self::XMLRPC_TYPE_STRUCT:
                return new Value\Struct($value);

            case self::XMLRPC_TYPE_INTEGER:
                return new Value\Integer($value);

            case self::XMLRPC_TYPE_DOUBLE:
                return new Value\Double($value);

            case self::XMLRPC_TYPE_BOOLEAN:
                return new Value\Boolean($value);

            case self::XMLRPC_TYPE_NIL:
                return new Value\Nil();

            case self::XMLRPC_TYPE_STRING:
                // Fall through to the next case
            default:
                // If type isn't identified (or identified as string), it treated as string
                return new Value\Text($value);
        }
    }

    // XML-RPC -> XML
    protected static function xmlStringToNativeXmlRpc($xml, int $libXmlOptions = 0)
    {
        static::createSimpleXMLElement($xml, $libXmlOptions);

        static::extractTypeAndValue($xml, $type, $value);

        switch ($type) {
            // All valid and known XML-RPC native values
            case self::XMLRPC_TYPE_I4:
                // Fall through to the next case
            case self::XMLRPC_TYPE_INTEGER:
                $xmlrpcValue = new Value\Integer($value);
                break;
            case self::XMLRPC_TYPE_APACHEI8:
                // Fall through to the next case
            case self::XMLRPC_TYPE_I8:
                $xmlrpcValue = self::$USE_BIGINT_FOR_I8 ? new Value\BigInteger($value) : new Value\Integer($value);
                break;
            case self::XMLRPC_TYPE_DOUBLE:
                $xmlrpcValue = new Value\Double($value);
                break;
            case self::XMLRPC_TYPE_BOOLEAN:
                $xmlrpcValue = new Value\Boolean($value);
                break;
            case self::XMLRPC_TYPE_STRING:
                $xmlrpcValue = new Value\Text($value);
                break;
            case self::XMLRPC_TYPE_DATETIME:  // The value should already be in an iso8601 format
                $xmlrpcValue = new Value\DateTime($value);
                break;
            case self::XMLRPC_TYPE_BASE64:    // The value should already be base64 encoded
                $xmlrpcValue = new Value\Base64($value, true);
                break;
            case self::XMLRPC_TYPE_NIL:
                // Fall through to the next case
            case self::XMLRPC_TYPE_APACHENIL:
                // The value should always be NULL
                $xmlrpcValue = new Value\Nil();
                break;
            case self::XMLRPC_TYPE_ARRAY:
                // PHP 5.2.4 introduced a regression in how empty($xml->value)
                // returns; need to look for the item specifically
                $data = null;
                foreach ($value->children() as $key => $value) {
                    if ('data' === $key) {
                        $data = $value;
                        break;
                    }
                }

                if (null === $data) {
                    throw new ValueException(
                        'Invalid XML for XML-RPC native '
                        . self::XMLRPC_TYPE_ARRAY
                        . ' type: ARRAY tag must contain DATA tag'
                    );
                }
                $values = [];
                // Parse all the elements of the array from the XML string
                // (simple xml element) to Value objects
                foreach ($data->value as $element) {
                    $values[] = static::xmlStringToNativeXmlRpc($element, $libXmlOptions);
                }
                $xmlrpcValue = new Value\ArrayValue($values);
                break;
            case self::XMLRPC_TYPE_STRUCT:
                $values = [];
                // Parse all the members of the struct from the XML string
                // (simple xml element) to Value objects
                foreach ($value->member as $member) {
                    // @todo? If a member doesn't have a <value> tag, we don't add it to the struct
                    // Maybe we want to throw an exception here ?
                    if (! isset($member->value) || ! isset($member->name)) {
                        continue;
                    }
                    $values[(string) $member->name] = static::xmlStringToNativeXmlRpc($member->value, $libXmlOptions);
                }
                $xmlrpcValue = new Value\Struct($values);
                break;
            default:
                throw new ValueException(
                    'Value type \'' . $type . '\' parsed from the XML string is not a known XML-RPC native type'
                );
        }
        $xmlrpcValue->setXML($xml->asXML());

        return $xmlrpcValue;
    }

    protected static function createSimpleXMLElement(&$xml, int $libXmlOptions = 0)
    {
        if ($xml instanceof SimpleXMLElement) {
            return;
        }

        try {
            $xml = new SimpleXMLElement($xml, $libXmlOptions);
        } catch (Exception $e) {
            // The given string is not a valid XML
            throw new ValueException(
                'Failed to create XML-RPC value from XML string: ' . $e->getMessage(),
                $e->getCode(),
                $e
            );
        }
    }

    // XML/RPC->SimpleXMLElement
    protected static function extractTypeAndValue(SimpleXMLElement $xml, &$type, &$value)
    {
        // Casting is necessary to work with strict-typed systems
        foreach ((array) $xml as $type => $value) {
            break;
        }
        if (! $type && $value === null) {
            $namespaces = ['ex' => 'http://ws.apache.org/xmlrpc/namespaces/extensions'];
            foreach ($namespaces as $namespaceName => $namespaceUri) {
                foreach ((array) $xml->children($namespaceUri) as $type => $value) {
                    break;
                }
                if ($type !== null) {
                    $type = $namespaceName . ':' . $type;
                    break;
                }
            }
        }

        // If no type was specified, the default is string
        if (! $type) {
            $type = self::XMLRPC_TYPE_STRING;
            if (empty($value) && preg_match('#^<value>.*</value>$#', $xml->asXML())) {
                $value = str_replace(['<value>', '</value>'], '', $xml->asXML());
            }
        }
    }

    protected function setXML($xml)
    {
        $this->xml = static::getGenerator()->stripDeclaration($xml);
    }
}
