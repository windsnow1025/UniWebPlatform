import pytest
from selenium import webdriver
from test.src.page.user import User


@pytest.fixture(scope="module")
def driver():
    driver = webdriver.Chrome()
    yield driver
    driver.quit()


@pytest.fixture
def user(driver):
    return User(driver)
