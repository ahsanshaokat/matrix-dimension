var RSSBot = require("./RSSBot");
var VectorRssBackbone = require("./VectorRssBackbone");
var UpstreamConfiguration = require("../../../UpstreamConfiguration");

var factory = (db, integrationConfig, roomId, scalarToken) => {
    factory.validateConfig(integrationConfig);

    return db.getUpstreamToken(scalarToken).then(upstreamToken => {
        var backbone = new VectorRssBackbone(roomId, upstreamToken);
        return new RSSBot(integrationConfig, backbone);
    });
};

factory.validateConfig = (integrationConfig) => {
    if (!integrationConfig.upstream) throw new Error("Unsupported configuration");
    if (integrationConfig.upstream.type !== "vector") throw new Error("Unsupported upstream");
    if (!UpstreamConfiguration.hasUpstream("vector")) throw new Error("Vector upstream not specified");
};

module.exports = factory;