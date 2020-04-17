module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_ORIGIN: 'https://tallyit.now.sh',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://macarina@localhost/tallyit',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://macarina@localhost/tallyit-test'
};