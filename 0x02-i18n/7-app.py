#!/usr/bin/env python3
"""
Flask Babel
"""

from flask import Flask, render_template, request, g
from flask_babel import Babel
from typing import Union, Dict
import pytz


class Config:
    """
    Configuration for babel
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    Retrieves locale
    """
    locale = request.args.get('locale')
    if locale:
        if locale in app.config["LANGUAGES"]:
            return locale
    elif g.user:
        locale = g.user.get('locale')
        if locale in app.config["LANGUAGES"]:
            return locale
    elif request.accept_languages:
        return request.accept_languages.best_match(app.config["LANGUAGES"])
    return app.config["BABEL_DEFAULT_LOCALE"]


@babel.timezoneselector
def get_timezone() -> str:
    """
    Retrieves Timezone
    """
    timezone = request.args.get('timezone', '').split()
    if not timezone and g.user:
        timezone = g.user.get('timezone')
    try:
        return pytz.timezone(timezone).zone
    except pytz.exceptions.UnknownTimeZoneError:
        return app.config['BABEL_DEFAULT_TIMEZONE']


def get_user() -> Union[Dict, None]:
    """
    Retrieves user
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id), None)
    return None


@app.route('/', strict_slashes=False)
def index() -> str:
    """
    Displays 7-index.html
    """
    return render_template('7-index.html')


@app.before_request
def before_request() -> None:
    """
    Executes before other functions
    """
    user = get_user()
    g.user = user


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
