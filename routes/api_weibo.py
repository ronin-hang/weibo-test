import json

from utils import log
from routes import json_response, current_user, login_required
from models.weibo import Weibo
from models.comment import Comment


def all(request):
    w = Weibo.all()
    for i in w:
        c = Comment.all(weibo_id=i.id)
        x = [t.json() for t in c]
        s = json.dumps(x, ensure_ascii=False)
        i.comment = s
        i.save(i.__dict__)
    weibos = Weibo.all_json()
    return json_response(weibos)


def add(request):
    form = request.json()
    u = current_user(request)
    t = Weibo.add(form, u.id)
    return json_response(t.json())


def delete(request):
    weibo_id = int(request.query['id'])
    c = Comment.all(weibo_id=weibo_id)
    for i in c:
        i.delete(i.id)
    Weibo.delete(weibo_id)
    d = dict(
        message="成功删除 weibo"
    )
    return json_response(d)


def update(request):
    form: dict = request.json()
    weibo_id = int(form.pop('id'))
    Weibo.update(weibo_id, **form)
    w = Weibo.one(id=int(weibo_id))
    return json_response(w.json())


def comment_add(request):
    form = request.json()
    weibo_id = form['weibo_id']
    u = current_user(request)
    t = Comment.add(form, u.id, weibo_id)
    return json_response(t.json())


def comment_delete(request):
    com_id = int(request.query['id'])
    Comment.delete(com_id)
    d = dict(
        message="成功删除 comment"
    )
    return json_response(d)


def comment_update(request):
    form: dict = request.json()
    comment_id = int(form.pop('id'))
    Comment.update(comment_id, **form)
    w = Comment.one(id=int(comment_id))
    return json_response(w.json())


def weibo_owner_required(route_function):

    def f(request):
        log('same_user_required')
        u = current_user(request)
        if 'id' in request.query:
            weibo_id = request.query['id']
        else:
            form = request.json()
            weibo_id = int(form['id'])
        w = Weibo.one(id=int(weibo_id))

        if w.user_id == u.id:
            return route_function(request)
        else:
            d = dict(
                message="权限不足"
            )
            return json_response(d)
            # denied()

    return f


def comment_owner_required(route_function):

    def f(request):
        log('same_user_required')
        u = current_user(request)
        if 'id' in request.query:
            comment_id = request.query['id']
        else:
            form = request.json()
            comment_id = int(form['id'])
        w = Comment.one(id=int(comment_id))
        z = Weibo.one(id=w.weibo_id)
        if w.user_id == u.id or u.id == z.user_id:
            return route_function(request)
        else:
            d = dict(
                message="权限不足"
            )
            return json_response(d)

    return f


def route_dict():
    d = {
        '/api/weibo/all': login_required(all),
        '/api/weibo/add': login_required(add),
        '/api/weibo/delete': login_required(weibo_owner_required(delete)),
        '/api/weibo/update': login_required(weibo_owner_required(update)),
        '/api/comment/add': login_required(comment_add),
        '/api/comment/delete': login_required(comment_owner_required(comment_delete)),
        '/api/comment/update': login_required(comment_owner_required(comment_update)),
    }
    return d
