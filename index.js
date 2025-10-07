import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const usersData = [
    {
        id: 1,
        firstName: 'Mike',
        lastName: 'Smith',
        date: new Date()
    },
    {
        id: 2,
        firstName: 'Danny',
        lastName: 'Gold',
        date: new Date()
    }
];

const addresses = [
    {
        userId: 1,
        houseNumber: '14',
        street: 'Good street',
        zipCode: 12345
    },
    {
        userId: 2,
        houseNumber: '10',
        street: 'Bad street',
        zipCode: 24688
    }
];


const typeDefs = `#graphql
    type User {
        firstName: String!
        lastName: String,
        date: String
    }

    type Address {
        houseNumber: Int!
        street: String!
        zipCode: Int
    }

    type UserResponse {
        user: User
        users: [User]
        address: Address
        addresses: [Address]
    }

    type Query {
        getSingleUser(id: ID!): UserResponse!
        getAllUsers: UserResponse
    }

    type Mutation {
        updateUser(id: Int!, firstName: String!): UserResponse!
        deleteUser(id: Int!): UserResponse
    }
`;

const resolvers = {
    Query: {
        getSingleUser(_, args) {
            const user = usersData.find((data) => data.id === parseInt(args.id));
            const address = addresses.find((data) => data.userId === parseInt(args.id));
            return {
                user,
                address
            }
        },
        getAllUsers(_, args) {
            return {
                users: usersData,
                addresses
            }
        }
    },
    Mutation: {
        updateUser(_, args) {
            const user = usersData.find((data) => data.id === args.id);
            const updatedUser = {...user, firstName: args.firstName};
            const address = addresses.find((data) => data.userId === args.id);
            return {
                user: updatedUser,
                address
            }
        },
        deleteUser(_, args) {
            const users = usersData.filter((data) => data.id !== args.id);
            const filteredAddresses = addresses.filter((data) => data.userId !== args.id);
            return {
                users,
                addresses: filteredAddresses
            }
        }
    },
    Address: {
        houseNumber: (address) => parseInt(address.houseNumber),
    },
    User: {
        date: (user) => new Date(user.date).toISOString()
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 8000 }});
console.log(`Server running at ${url}`);