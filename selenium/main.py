import time

from selenium import webdriver

import user

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:3000")
    signed_in_status = user.is_signed_in(driver)
    if signed_in_status:
        user.sign_out(driver)
    user.sign_in(driver)
    time.sleep(1)
    signed_in_status = user.is_signed_in(driver)
    assert signed_in_status
except Exception as e:
    print(e)
finally:
    driver.quit()

