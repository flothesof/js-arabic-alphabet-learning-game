describe('sample test', function() {
    let page;

    before(async function() {
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
    });

    after(async function() {
        await page.close();
    })

    it('should have the correct page title', async function() {
        console.log(page.title());
        expect(await page.title()).to.eql('Puppeteer Mocha');
    });

    it('should have a heading', async function() {
        const HEADING_SELECTOR = 'h1';
        let heading;

        await page.waitFor(HEADING_SELECTOR);
        heading = await page.$eval(HEADING_SELECTOR, heading => heading.innerText);

        expect(heading).to.eql('Page Title');
    });

    it('should have a single content section', async function() {
        const BODY_SELECTOR = '.main-content';

        await page.waitFor(BODY_SELECTOR);

        expect(await page.$$(BODY_SELECTOR)).to.have.lengthOf(1);
    });
});