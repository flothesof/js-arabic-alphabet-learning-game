const Koa = require("koa");
const http = require("http");
const serve = require("koa-static");
const puppeteer = require("puppeteer");
const { expect } = require("chai");

describe("UI test suite for alphabet game", function() {
    let browser;
    let server;
    let page;

    before(async function() {
        this.timeout(10000);
        const app = new Koa();
        app.use(serve("."));
        server = http.createServer(app.callback());
        server.listen(3000);

        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
        });
    });

    beforeEach(async() => {
        page = await browser.newPage();
        await page.goto("http://localhost:3000");
    });

    afterEach(async() => {
        await page.close();
    });

    after(async function() {
        await browser.close();
        await new Promise((resolve) => {
            server.close(resolve);
        });
    });

    it("should have the correct page title", async function() {
        expect(await page.title()).to.eql("Apprendre l'alphabet arabe !");
    });

    it("should have a heading", async function() {
        const HEADING_SELECTOR = "h1";
        let heading;

        await page.waitFor(HEADING_SELECTOR);
        heading = await page.$eval(
            HEADING_SELECTOR,
            (heading) => heading.innerText
        );

        expect(heading).to.eql("Apprendre l'alphabet arabe !");
    });

    it("should have a single content section", async function() {
        const BODY_SELECTOR = ".modal";

        await page.waitFor(BODY_SELECTOR);

        expect(await page.$$(BODY_SELECTOR)).to.have.lengthOf(1);
    });
});