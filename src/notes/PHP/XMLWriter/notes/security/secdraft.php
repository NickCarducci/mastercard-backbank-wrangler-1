<?php
use DOMDocument;
use SimpleXMLElement;

class Security {
    const ENTITY_DETECT = 'Detected use of ENTITY in XML, disabled to prevent XXE/XEE attacks';

    // Heuristic expansion or external declaration
    protected static function heuristicScan($xml)
    {
        foreach (self::getEntityComparison($xml) as $compare) {
            if (strpos($xml, $compare) !== false) {
                throw new Exception\RuntimeException(self::ENTITY_DETECT);
            }
        }
    }
    private static function scanString($xml, DOMDocument $dom = null, $libXmlConstants, callable $cbdom)
    {
        // If running with PHP-FPM we perform an heuristic scan
        // We cannot use libxml_disable_entity_loader because of this bug
        // @see https://bugs.php.net/bug.php?id=64938
        if (self::isPhpFpm()) {
            self::heuristicScan($xml);
        }

        if (null === $dom) {
            $simpleXml = true;
            $dom = new DOMDocument();
        }

        if (! self::isPhpFpm()) {
            if (\PHP_VERSION_ID < 80000) {
                $loadEntities = libxml_disable_entity_loader(true);
            }
            $useInternalXmlErrors = libxml_use_internal_errors(true);
        }

        // Load XML with network access disabled (LIBXML_NONET)
        // error disabled with @ for PHP-FPM scenario
        set_error_handler(function ($errno, $errstr) {
            if (substr_count($errstr, 'DOMDocument::loadXML()') > 0) {
                return true;
            }
            return false;
        }, E_WARNING);

        $result = $cbdom($xml, $dom, LIBXML_NONET | $libXmlConstants);

        restore_error_handler();

        if (! $result) {
            // Entity load to previous setting
            if (! self::isPhpFpm()) {
                if (\PHP_VERSION_ID < 80000) {
                    libxml_disable_entity_loader($loadEntities);
                }
                libxml_use_internal_errors($useInternalXmlErrors);
            }
            return false;
        }

        // Scan for potential XEE attacks using ENTITY, if not PHP-FPM
        if (! self::isPhpFpm()) {
            foreach ($dom->childNodes as $child) {
                if ($child->nodeType === XML_DOCUMENT_TYPE_NODE) {
                    if ($child->entities->length > 0) {
                        throw new Exception\RuntimeException(self::ENTITY_DETECT);
                    }
                }
            }
        }

        // Entity load to previous setting
        if (! self::isPhpFpm()) {
            if (\PHP_VERSION_ID < 80000) {
                libxml_disable_entity_loader($loadEntities);
            }
            libxml_use_internal_errors($useInternalXmlErrors);
        }

        if (isset($simpleXml)) {
            $result = simplexml_import_dom($dom);
            if (! $result instanceof SimpleXMLElement) {
                return false;
            }
            return $result;
        }
        return $dom;
    }
    public static function scan($xml, DOMDocument $dom = null, $libXmlConstants = 0)
    {
        $cbdom = function ($xml, $dom, $constants) {
            return $dom->loadXml($xml, $constants);
        };
        return self::scanString($xml, $dom, $libXmlConstants, $cbdom);
    }
    public static function scanHtml($html, DOMDocument $dom = null, $libXmlConstants = 0)
    {
        $cbdom = function ($html, $dom, $constants) {
            return $dom->loadHtml($html, $constants);
        };
        return self::scanString($html, $dom, $libXmlConstants, $cbdom);
    }
    public static function scanFile($file, DOMDocument $dom = null)
    {
        if (! file_exists($file)) {
            throw new Exception\InvalidArgumentException(
                "The file $file specified doesn't exist"
            );
        }
        return self::scan(file_get_contents($file), $dom);
    }
}
