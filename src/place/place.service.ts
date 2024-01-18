import { Injectable } from "@nestjs/common";
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
// import { ContentType } from './type';
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import axios from "axios";
import { ContentType } from "aws-sdk/clients/cloudsearchdomain";

@Injectable()
export class PlaceService {
    // async getHtml(url: string) {
    //     const html = await axios.get(url);
    //     const $ = cheerio.load(html.data);
    //     let content: ContentType[] = [];
    //     const place = $(".SpaceItemstyle__Container-sc-1wddfv-5 kjjHma");
    //     place.map((idx, el) => {
    //         content[idx] = {
    //             name: $(el)
    //                 .find(".SpaceItemstyle__HostName-sc-1wddfv-7 cYSAQg")
    //                 .text(),
    //             location: $(el)
    //                 .find("SpaceItemstyle__Address-sc-1wddfv-15 ijNkov")
    //                 .text(),
    //             // href: $(el).find("a:first-child").attr("href"),
    //         };
    //     });
    // }
}
