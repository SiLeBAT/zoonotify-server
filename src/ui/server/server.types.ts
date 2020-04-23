const SERVER_TYPES = {
    AppServerConfiguration: Symbol.for('AppServerConfiguration'),
    InfoController: Symbol.for('InfoController'),
    MockDataController: Symbol.for('MockDataController'),
    VersionRootController: Symbol.for('VersionRootController'),
    APIDocsController: Symbol.for('APIDocsController'),
    SwaggerMW: Symbol.for('SwaggerMW')
};

export default SERVER_TYPES;
