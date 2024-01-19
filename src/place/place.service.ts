import { Injectable } from "@nestjs/common";
import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
// import { ContentType } from './type';
// import puppeteer from "puppeteer-core";
import * as puppeteer from "puppeteer";
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

    async crawlWebsite(url: string): Promise<string> {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080,
        // });

        // 네트워크 요청이 완료될 때까지 기다림
        await page.goto(url, { waitUntil: "networkidle2" });
        await page.click(
            ".IntroMobilestyle__LifeContainer-sc-15hynk6-6.eUoLDw",
        );

        // await page.waitForSelector(
        //     ".GnbPCstyle__CommonBtn-sc-3mhzew-2.GnbPCstyle__Btn-sc-3mhzew-5.jygHnB",
        // );

        // await page.click(
        //     ".GnbPCstyle__CommonBtn-sc-3mhzew-2.GnbPCstyle__Btn-sc-3mhzew-5.jygHnB",
        // );

        // await page.waitForSelector(
        //     ".SpaceItemstyle__SpaceItem-sc-1wddfv-0.fQSBZt",
        // );

        const content = await page.content();
        await browser.close();
        // console.log(content);
        return content;
    }

    async extractTextFromTag(content: string): Promise<string[]> {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setContent(content);
        console.log(content);
        const elements = await page.$$(
            ".SpaceItemstyle__HostName-sc-1wddfv-7.cYSAQg",
        );
        console.log(elements);
        const texts = await Promise.all(
            elements.map((element) =>
                page.evaluate((el) => el.textContent, element),
            ),
        );

        await browser.close();

        return texts;
    }
}
