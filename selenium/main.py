from selenium import webdriver

from user import User

driver = webdriver.Chrome()

try:
    driver.get("http://localhost:3000")
    user = User(driver)
    signed_in_status = user.is_signed_in()
    if signed_in_status:
        user.sign_out()
    user.sign_in()
    signed_in_status = user.is_signed_in()
    assert signed_in_status
except Exception as e:
    print(e)
finally:
    driver.quit()

