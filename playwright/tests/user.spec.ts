import { test, expect } from '@playwright/test';
import { User } from './user';

test.describe('User Sign In/Out', () => {
    let user: User;

    test.beforeEach(async ({ page }) => {
        user = new User(page);
        await user.navigate();
    });

    test('should sign in and out successfully', async ({ page }) => {
        if (await user.isSignedIn()) {
            await user.signOut();
        }

        await user.signIn('test', 'test');
        expect(await user.isSignedIn()).toBeTruthy();

        await user.signOut();
        expect(await user.isSignedIn()).toBeFalsy();
    });
});