import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import AllExceptionsFilter from '@filters/exeption';
import GraphqlConfigService from '@config/graphql.config';

@Module({
    imports: [
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            useClass: GraphqlConfigService,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        }
    ],
})
export class AppModule {
}
