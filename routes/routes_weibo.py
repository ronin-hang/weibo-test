from routes import (
    redirect,
    current_user,
    html_response,
    login_required,
    TestTemplate, html_response1)


def index(request):
    body = TestTemplate.render('weibo_index.html')
    return html_response1(body)


def route_dict():
    d = {
        '/weibo/index': login_required(index),
    }
    return d
