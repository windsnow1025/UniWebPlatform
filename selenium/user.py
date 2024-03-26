from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import *
from selenium.webdriver.support.wait import WebDriverWait


class User:
    def __init__(self, webdriver):
        self.driver = webdriver
        self.wait = WebDriverWait(self.driver, timeout=1)
        self.sign_in_button_path = "//button[normalize-space(text())='Sign In']"
        self.user_center_link_path = "//a[@href='/user-center']"
        self.username_input_path = "//label[text()='Username']/following-sibling::div//input"
        self.password_input_path = "//label[text()='Password']/following-sibling::div//input"
        self.sign_out_link_path = "//a[normalize-space(text())='Sign Out']"

    def is_signed_in(self):
        try:
            self.wait.until(presence_of_element_located((By.XPATH, self.sign_in_button_path)))
            return False
        except NoSuchElementException:
            self.driver.find_element(By.XPATH, self.user_center_link_path)
            return True

    def sign_in(self):
        self.wait.until(presence_of_element_located((By.XPATH, self.sign_in_button_path))).click()
        username_input = self.wait.until(presence_of_element_located((By.XPATH, self.username_input_path)))
        username_input.send_keys("test")
        password_input = self.driver.find_element(By.XPATH, self.password_input_path)
        password_input.send_keys("test")
        self.driver.find_element(By.XPATH, self.sign_in_button_path).click()

    def sign_out(self):
        self.driver.find_element(By.XPATH, self.sign_out_link_path).click()
