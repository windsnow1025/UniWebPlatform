from selenium.common import TimeoutException
from selenium.webdriver.remote.webdriver import WebDriver

from test.src.scraper import Scraper


class User(Scraper):
    def __init__(self, driver: WebDriver):
        self.base_url = "http://localhost:3000"
        super().__init__(driver, self.base_url)

        self.sign_in_button_path = "//button[contains(text(), 'Sign In')]"
        self.user_account_link_path = "//a[@href='/user/account']"
        self.username_input_path = "//label[text()='Username']/following-sibling::div//input"
        self.password_input_path = "//label[text()='Password']/following-sibling::div//input"
        self.sign_out_button_path = "//button[contains(text(), 'Sign Out')]"

    def is_signed_in(self):
        try:
            self._wait_find(self.user_account_link_path)
            return True
        except TimeoutException:
            self._wait_find(self.sign_in_button_path)
            return False

    def sign_in(self, username: str, password: str):
        self._wait_find(self.sign_in_button_path).click()
        self._wait_find(self.username_input_path).send_keys(username)
        self._wait_find(self.password_input_path).send_keys(password)
        self._wait_find(self.sign_in_button_path).click()

    def sign_out(self):
        self._wait_find(self.sign_out_button_path).click()
