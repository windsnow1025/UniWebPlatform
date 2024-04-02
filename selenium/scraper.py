from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import *
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement


class Scraper:
    def __init__(self, url: str):
        self.driver = webdriver.Chrome()
        self.driver.get(url)

    def _wait(
            self,
            element: WebDriver | WebElement = None,
            timeout: float = 2
    ) -> WebDriverWait:
        if element is None:
            element = self.driver
        return WebDriverWait(element, timeout=timeout)

    def _wait_find(
            self,
            path: str,
            element: WebDriver | WebElement = None,
            find_all: bool = False,
            timeout: float = 2
    ) -> WebElement | list[WebElement]:
        if element is None:
            element = self.driver
        wait = self._wait(element, timeout=timeout)
        if find_all is False:
            return wait.until(presence_of_element_located((By.XPATH, path)))
        if find_all is True:
            return wait.until(presence_of_all_elements_located((By.XPATH, path)))

    def _wait_for_staleness(
            self,
            element: WebDriver | WebElement = None,
            timeout: float = 2
    ):
        if element is None:
            element = self.driver
        WebDriverWait(self.driver, timeout).until(staleness_of(element))
