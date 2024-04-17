from selenium import webdriver

from user import User

try:
    webdriver = webdriver.Chrome()
    user = User(webdriver)
    signed_in_status = user.is_signed_in()
    if signed_in_status:
        user.sign_out()
    user.sign_in()
    signed_in_status = user.is_signed_in()
    assert signed_in_status
except Exception as e:
    raise e

