from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By


def is_signed_in(driver):
    try:
        driver.find_element(By.XPATH, "//button[normalize-space(text())='Sign In']")
        return False
    except NoSuchElementException:
        driver.find_element(By.XPATH, "//a[@href='/user-center']")
        return True


def sign_in(driver):
    driver.find_element(By.XPATH, "//button[normalize-space(text())='Sign In']").click()
    driver.implicitly_wait(0.5)
    username_input = driver.find_element(By.XPATH, "//label[text()='Username']/following-sibling::div//input")
    username_input.send_keys("test")
    password_input = driver.find_element(By.XPATH, "//label[text()='Password']/following-sibling::div//input")
    password_input.send_keys("test")
    driver.find_element(By.XPATH, "//button[normalize-space(text())='Sign In']").click()


def sign_out(driver):
    driver.find_element(By.XPATH, "//a[normalize-space(text())='Sign Out']").click()