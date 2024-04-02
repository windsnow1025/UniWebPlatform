from user import User

try:
    user = User()
    signed_in_status = user.is_signed_in()
    if signed_in_status:
        user.sign_out()
    user.sign_in()
    signed_in_status = user.is_signed_in()
    assert signed_in_status
except Exception as e:
    raise e

