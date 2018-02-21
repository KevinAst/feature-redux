# NPM Scripts

The following npm scripts are available for this project.

```
DEVELOPMENT
===========

start ... convenience alias to 'dev' (that launches continous dev process)

dev ...... launch development process (continuous integration)
           NOTE: Currently this is an alias to test:watch
                 Other options to consider: 
                  - npm-run-all --parallel build:watch test:watch
                    ... advantage of continuous build is that auto-linting is performed


BUILDING
========

build ................... bundle library for publication (same as 'build:plat:bundle')
build:watch  ............ ditto (continuously)

build:plat:{platform} ... bundle library for specified Target Platform (see below)
build:plat:bundle
build:plat:bundle.min
build:plat:lib
build:plat:es
build:plat:all
build:clean ............. clean all machine-generated build directories

prepublish .............. cleanly build/test all machine generated resources,
                          a pre-publication utility:
                            - verify code quality (lint)
                            - show outdated installed packages
                            - clean (delete) ALL machine generated resources
                            - build all bundled libraries (for publication)
                            - test (against our master src)
                            - generate the code coverage report



TESTING
=======

test ......... run ALL unit tests on master src
test:watch ... ditto (continuously)



CODE QUALITY
============

check ... convenience script to:
           - verify code quality (lint)
           - show outdated installed packages
           - run tests (against our master src)
           - generate the code coverage report

lint .... verify code quality, linting BOTH production and test code.
          NOTE: Real-time linting is ALSO applied on production code
                through our WebPack bundler (via 'build:watch')!

cov ........... evaluate code coverage in executing our test suite (gen report in coverage/)
cov:publish ... publish code coverage results to codacy.com (for visiblity)
cov:clean ..... clean the machine-generated coverage/ directory

pkgReview ... show outdated installed packages



MISC
====

clean ... cleans ALL machine-generated directories (build, and coverage)
```


## Target Platform

Some npm scripts target a platform (i.e. the JS module ecosystem),
using 'plat' nomenclature (i.e. platform).

Specifically:

 - `build:plat:{platform}`

Supported platforms are:

```
Env Variable
MODULE_PLATFORM  What                 Bindings  Found In               NOTES                   
===============  ===================  ========  =====================  ========================
src              master ES6 source    ES        src/*.js               DEFAULT                 
bundle           bundled ES5          CommonJS  dist/{project}.js                              
bundle.min       bundled/minified ES5 CommonJS  dist/{project}.min.js                          
lib              ES5 source           CommonJS  lib/*.js                                       
es               ES5 source           ES        es/*.js                                        
all              all of the above                                      Used in npm scripts ONLY
```
