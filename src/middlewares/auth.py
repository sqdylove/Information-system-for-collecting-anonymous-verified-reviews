def check_token(token, box):
    if token != box.owner_token:
        raise Exception("Forbidden")