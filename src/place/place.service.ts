import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import axios from "axios";
import { ContentType } from "aws-sdk/clients/cloudsearchdomain";

@Injectable()
export class PlaceService {
    // async getTitle(url: string): Promise<string> {
    //     const response = await axios.get(url);
    //     const $ = cheerio.load(response.data);
    //     const title = $("title").text();
    //     return title;
    // }

    async crawlSpaces(url: string) {
        try {
            const response = await axios
                .get(url, {
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                    },
                })
                .then(function (response) {
                    console.log(response.data.content.resources.length);
                    const test = response.data.content.resources;
                    test.forEach((t) => {
                        console.log(t.address);
                        console.log(t.host.name);
                        console.log(t.photos[0].file.resourcePath);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            throw new Error(`Error in crawlSpaces: ${error.message}`);
        }
    }
}
