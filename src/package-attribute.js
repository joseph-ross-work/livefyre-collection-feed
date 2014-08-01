var packageAttributeBuilder = require('livefyre-package-attribute');
var packageJson = require('json!collection-feed/../package.json');

module.exports = packageAttributeBuilder(packageJson);
