import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as AWS from "aws-sdk";

@Injectable()
export class AwsService {
    constructor(private readonly configService: ConfigService) {}
    s3 = new AWS.S3();
    async fileupload(file: Express.Multer.File) {
        const upload = await this.s3
            .upload({
                Bucket: this.configService.get<string>("S3BUCKET"),
                Key: `${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ACL: "public-read",
            })
            .promise();
        return upload.Location;
    }
}
