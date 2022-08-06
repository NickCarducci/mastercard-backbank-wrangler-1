pecl.php.net

xml sitemap (gnu_m4/[rss](https://www.quora.com/What-is-the-most-effective-way-to-promote-a-podcast/answer/Nick-Carducci)/...)

### (cli) babel index.php -o babelphp.js

(npm) babel-preset-php

[(cloudflare)](https://github.com/cloudflare/php-worker-hello-world) php-worker-hello-world

Instead, use Emscripten Wasm worker

Or, thrift

Or, a [new extension by PHP](https://github.com/php/php-src/blob/master/ext/ext_skel.php)... but wait... GNU::bison 3.8.2 is not being read by PHP upon Mac OS homebrew commands.

> "Tweak zendparse to be exported through ZEND_API. ...once
> bison supports foreign [skeletons](https://github.com/NickCarducci/mastercard-backbank/tree/main/src/PHP/GNU) and that bison version is used. [Read](https://git.savannah.gnu.org/cgit/bison.git/tree/data/README.md)"

## [PHP Extension for C++](https://www.zend.com/setting-up-your-php-build-environment)

Mac OS

brew install autoconf automake bison flex re2c gdb \
    libtool make pkgconf valgrind git libxml2

git clone https://github.com/php/php-src.git && cd php-src && git checkout php-8.1.6

./buildconf --force && ./configure --enable-debug \                
    --prefix=$HOME/php-bin/DEBUG \
    --with-config-file-path=$HOME/php-bin/DEBUG/etc
    
Or... [pear/XML_Serializer](https://github.com/pear/XML_Serializer)

