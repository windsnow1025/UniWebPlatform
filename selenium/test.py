def test_user_sign_in_out(user):
    if user.is_signed_in():
        user.sign_out()

    user.sign_in("test", "test")

    assert user.is_signed_in()

    user.sign_out()

    assert not user.is_signed_in()
