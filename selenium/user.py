from selenium.common import TimeoutException

from scraper import Scraper


class User(Scraper):
    def __init__(self):
        super().__init__("http://localhost:3000")

        self.sign_in_button_path = "//button[normalize-space(text())='Sign In']"
        self.user_account_link_path = "//a[@href='/user/account']"
        self.username_input_path = "//label[text()='Username']/following-sibling::div//input"
        self.password_input_path = "//label[text()='Password']/following-sibling::div//input"
        self.sign_out_link_path = "//a[normalize-space(text())='Sign Out']"

    def is_signed_in(self):
        try:
            self._wait_find(self.user_account_link_path)
            return True
        except TimeoutException:
            self._wait_find(self.sign_in_button_path)
            return False

    def sign_in(self):
        self._wait_find(self.sign_in_button_path).click()
        self._wait_find(self.username_input_path).send_keys("test")
        self._wait_find(self.password_input_path).send_keys("test")
        self._wait_find(self.sign_in_button_path).click()

    def sign_out(self):
        self._wait_find(self.sign_out_link_path).click()
