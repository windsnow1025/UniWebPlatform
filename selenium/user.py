from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait


class User:
    def __init__(self, webdriver):
        self.driver = webdriver
        self.wait = WebDriverWait(self.driver, timeout=1)

    def is_signed_in(self):
        try:
            self.wait.until(expected_conditions.presence_of_element_located((
                By.XPATH, "//button[normalize-space(text())='Sign In']"
            )))
            return False
        except NoSuchElementException:
            self.driver.find_element(By.XPATH, "//a[@href='/user-center']")
            return True

    def sign_in(self):
        self.wait.until(expected_conditions.presence_of_element_located((
            By.XPATH, "//button[normalize-space(text())='Sign In']"
        ))).click()
        username_input = self.wait.until(expected_conditions.presence_of_element_located((
            By.XPATH, "//label[text()='Username']/following-sibling::div//input"
        )))
        username_input.send_keys("test")
        password_input = self.driver.find_element(By.XPATH, "//label[text()='Password']/following-sibling::div//input")
        password_input.send_keys("test")
        self.driver.find_element(By.XPATH, "//button[normalize-space(text())='Sign In']").click()

    def sign_out(self):
        self.driver.find_element(By.XPATH, "//a[normalize-space(text())='Sign Out']").click()
