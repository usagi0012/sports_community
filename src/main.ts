import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import {
    DocumentBuilder,
    SwaggerCustomOptions,
    SwaggerModule,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { SocketIoAdapter } from "./adapters/socket-io.adapters";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useWebSocketAdapter(new SocketIoAdapter(app));
    app.useStaticAssets(join(__dirname, "..", "assets")); //html,js,css (바닐라)
    app.setBaseViewsDir(join(__dirname, "..", "views"));
    app.useStaticAssets(join(__dirname, "..", "social-login")); // 네이버, 카카오 소셜로그인 테스트
    app.setBaseViewsDir(join(__dirname, "templates"));
    app.setViewEngine("ejs");

    app.setGlobalPrefix("api", { exclude: ["/view/chat"] });
    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            // forbidNonWhitelisted: true,
        }),
    );

    // Swagger
    const swaggerCustomOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
        },
    };

    const config = new DocumentBuilder()
        .setTitle("Webtoon Recommend")
        .setDescription("Webtoon Recommend API description")
        .setVersion("1.0")
        .addTag("webtoon")
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "Token" },
            "accessToken",
        )
        .addBearerAuth(
            { type: "http", scheme: "bearer", bearerFormat: "Token" },
            "refreshToken",
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document, swaggerCustomOptions);

    // 환경 변수 설정
    const configService = app.get(ConfigService);
    const port: number = configService.get("SERVER_PORT");

    app.enableCors();
    await app.listen(port);
}
bootstrap();
function cors(): any {
    throw new Error("Function not implemented.");
}
