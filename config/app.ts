export const appConfig = {

    GLOBAL: {},
    DATABASE: {
        adminUsername: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: 'profile_contact'
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