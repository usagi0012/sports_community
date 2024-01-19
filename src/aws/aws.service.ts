import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AwsService {
    // constructor(private readonly configService: ConfigService) {}
    // async fileupload(file: Express.Multer.File) {
    //     const s3Client = new S3Client({
    //         region: this.configService.get<string>("AWS_REGION"),
    //         credentials: {
    //             accessKeyId:
    //                 this.configService.get<string>("AWS_ACCESS_KEY_ID"),
    //             secretAccessKey: this.configService.get<string>(
    //                 "AWS_SECRET_ACCESS_KEY",
    //             ),
    //         },
    //     });
    //     const objectKey = `${Date.now()}-${file.originalname}`;
    //     const upload = await s3Client.send(
    //         new PutObjectCommand({
    //             Bucket: this.configService.get<string>("S3BUCKET"),
    //             Key: objectKey,
    //             Body: file.buffer,
    //             ACL: "public-read",
    //             ContentType: file.mimetype,
    //         }),
    //     );
    //     console.log(upload);
    //     const objectUrl = `https://${this.configService.get<string>(
    //         "S3BUCKET",
    //     )}.s3.amazonaws.com/${objectKey}`;
    //     return objectUrl;
    // }
}
