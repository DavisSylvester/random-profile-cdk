export const appConfig = {

    GLOBAL: {},
    DATABASE: {
        adminUsername: process.env.DATABASE_USERNAME || 'admin',
        password: process.env.DATABASE_PASSWORD || 'admin',
        name: 'profile-contact'
    },
    VIRTUAL_NETWORK: {
        CIDR: '172.16.12.0/22',
        RDS: {
            CIDR_MASK: 28,
            NAME: 'random-profile-private-db'
        },
        PRIVATE: {
            NAME: 'random-profile-nat',
        },
        PUBLIC: {
            CIDR_MASK: 24,
            NAME: 'random-profile-public',
        }
    }
};