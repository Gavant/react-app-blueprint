module.exports = {
    files: '**',
    from: '{{APP_NAME}}',
    ignore: ['.yarn', 'node_modules'],
    to: process.argv[1],
};
