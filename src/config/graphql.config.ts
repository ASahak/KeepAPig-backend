import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Injectable()
export default class GraphqlConfigService implements GqlOptionsFactory {
    createGqlOptions(): ApolloDriverConfig {
        return {
            autoSchemaFile: true,
            useGlobalPrefix: true,
            context: ({ req, res }) => ({ req, res }),
            path: '/graphql',
            formatError: (error: GraphQLError) => {
                const graphQLFormattedError: GraphQLFormattedError = {
                    message: error?.extensions?.exception?.message || error?.message,
                };
                return graphQLFormattedError;
            },
            debug: process.env.NODE_ENV.trim() === 'development',
            playground: process.env.NODE_ENV.trim() === 'development',
        };
    }
}
