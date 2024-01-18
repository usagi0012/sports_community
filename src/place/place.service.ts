import { Injectable } from "@nestjs/common";
import type { NextApiRequest, NextApiResponse } from "next";
import cheerio, { Element } from "cheerio";
// import { ContentType } from './type';
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

@Injectable()
export class PlaceService {}
