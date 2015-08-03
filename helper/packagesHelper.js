var _ = require('lodash')

module.exports = {

    getBowerPackageIds: function() {
        // read bower.json and get dependencies' package ids
        var bowerManifest = {};
        try {
            bowerManifest = require('./../bower.json');
        } catch (e) {
            // does not have a bower.json manifest
        }
        return _.keys(bowerManifest.dependencies) || [];

    },

    getNPMPackageIds: function() {
        // read package.json and get dependencies' package ids
        var packageManifest = {};
        try {
            packageManifest = require('./../package.json');
        } catch (e) {
            // does not have a package.json manifest
        }
        return _.keys(packageManifest.devDependencies) || [];
    }
}