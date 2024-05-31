import { Page } from '@playwright/test';

export class User {
    private page: Page;
    private baseUrl: string = 'http://localhost:3000';

    private signInButtonSelector: string = "//button[contains(text(), 'Sign In')]";
    private userAccountLinkSelector: string = "//a[@href='/user/account']";
    private usernameInputSelector: string = "//label[text()='Username']/following-sibling::div//input";
    private passwordInputSelector: string = "//label[text()='Password']/following-sibling::div//input";
    private signOutButtonSelector: string = "//button[contains(text(), 'Sign Out')]";

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto(this.baseUrl);
    }

    async isSignedIn(): Promise<boolean> {
        try {
            await this.page.waitForSelector(this.userAccountLinkSelector, { timeout: 1000 });
            return true;
        } catch {
            await this.page.waitForSelector(this.signInButtonSelector, { timeout: 1000 });
            return false;
        }
    }

    async signIn(username: string, password: string) {
        await this.page.click(this.signInButtonSelector);
        await this.page.fill(this.usernameInputSelector, username);
        await this.page.fill(this.passwordInputSelector, password);
        await this.page.click(this.signInButtonSelector);
    }

    async signOut() {
        await this.page.click(this.signOutButtonSelector);
    }
}