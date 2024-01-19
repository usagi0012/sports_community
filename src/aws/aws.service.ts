import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as AWS from "aws-sdk";

@Injectable()
export class AwsService {
    constructor(private readonly configService: ConfigService) {}
    s3 = new AWS.S3();

    // async fileupload(file: Express.Multer.File) {
    //     const upload = await this.s3
    //         .upload({
    //             Bucket: this.configService.get<string>("S3BUCKET"),
    //             Key: `${Date.now()}-${file.originalname}`,
    //             Body: file.buffer,
    //             ACL: "public-read",
    //         })
    //         .promise();

    //     return upload.Location;
    // }

    async fileupload(file: Express.Multer.File) {
        const s3Client = new S3Client({
            region: this.configService.get<string>("AWS_REGION"),
            credentials: {
                accessKeyId:
                    this.configService.get<string>("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.get<string>(
                    "AWS_SECRET_ACCESS_KEY",
                ),
            },
        });
        const objectKey = `${Date.now()}-${encodeURIComponent(
            file.originalname,
        )}`;
        const upload = await s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get<string>("S3BUCKET"),
                Key: objectKey,
                Body: file.buffer,
                ACL: "public-read",
                ContentType: file.mimetype,
            }),
        );

        const objectUrl = `https://${this.configService.get<string>(
            "S3BUCKET",
        )}.s3.amazonaws.com/${objectKey}`;
        return objectUrl;
    }
}
