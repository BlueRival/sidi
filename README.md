SiDI (pronounced See Dee)
====

A simple dependency injection container.

Currently, SiDI is just a container, but near future plans will turn it into a
dependency assembler as well.

Usage
===

```js

var Container = require('sidi').Container;
var DB = require('db');
var container = new Container();
var config = require('config');

// Basic Set/Get resources

container.set('db', new DB(config));

var db = container.get('db');

// Factory resources

container.setFactory('db', DB);

var db = container.create('db', config);


```
