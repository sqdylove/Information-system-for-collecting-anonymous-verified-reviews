import re

BAD_WORDS = ["badword"]

def validate_text(text: str):
    if len(text) > 500:
        raise ValueError("Too long")

    for word in BAD_WORDS:
        if word in text.lower():
            raise ValueError("Bad word")

    # удаление ссылок
    text = re.sub(r"http\\S+", "", text)
    return text