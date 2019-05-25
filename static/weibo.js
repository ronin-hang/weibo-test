var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = `/api/weibo/update`
    ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = `/api/comment/update`
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-title">${weibo.content}</span>
            <button class="weibo-edit">编辑</button>
            <button class="weibo-delete">删除</button>
            <input class="comment-add-input"/>
            <button class="comment-add">添加评论</button>
        </div>
    `
    return t
}

var weiboCommentTemplate = function(weibo, comments) {
    var t = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-title">${weibo.content}</span>
            <button class="weibo-edit">编辑</button>
            <button class="weibo-delete">删除</button><br>
            <input class="comment-add-input"/>
            <button class="comment-add">添加评论</button>
            <div class="comment-list">${comments}</div>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function(content) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}"/>
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var t = `
        <div class="comment-cell" data-commentid="${comment.id}">
            <span class="comment-title">${comment.content}</span>
            <button class="comment-delete">删除评论</button>
            <button class="comment-edit">编辑</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(content) {
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}"/>
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
}

var insertUpdateForm = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertCommentUpdateForm = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertWeiboAll = function(comment, weibo) {
    var x = weiboCommentTemplate(weibo, comment)
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', x)
}

var insertCommentAddForm = function(comment, weiboCell) {
    var commentAddForm = commentTemplate(comment)
    weiboCell.insertAdjacentHTML('beforeend', commentAddForm)
}

var loadWeibos = function() {
    apiWeiboAll(function(weibos) {
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            var t = ``
            var s = JSON.parse(weibo.comment)
            for (var j = 0; j < s.length; j++) {
                var comment = s[j]
                t = t + commentTemplate(comment)
            }
            insertWeiboAll(t, weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(weibo) {
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        var weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            log('apiWeiboDelete', r.message)
            if (r.message === '权限不足') {
                alert(r.message)
            } else {
                self.parentElement.remove()
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮', self)
        var weiboCell = self.closest('.weibo-cell')
        var weiboId = weiboCell.dataset['id']
        var weiboSpan = e('.weibo-title', weiboCell)
        var content = weiboSpan.innerText
        insertUpdateForm(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了删除按钮')
        var weiboCell = self.closest('.weibo-cell')
        var weiboId = weiboCell.dataset['id']
        var weiboInput = e('.weibo-update-input', weiboCell)
        var content =weiboInput.value
        var form = {
            id: weiboId,
            content: content,
        }

        apiWeiboUpdate(form, function(weibo) {
            log('apiTodoUpdate', weibo)
            if (weibo.message === undefined) {
                var weiboSpan = e('.weibo-title', weiboCell)
                weiboSpan.innerText = weibo.content
                var updateForm = e('.weibo-update-form', weiboCell)
                updateForm.remove()
                alert('更新成功')
            } else {
                alert(weibo.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    var self = event.target
    if (self.classList.contains('comment-add')) {
        var weiboCell = self.closest('.weibo-cell')
        var commentAddInput = e('.comment-add-input', weiboCell)
        var content =commentAddInput.value
        var weiboId = weiboCell.dataset['id']
        var form = {
        weibo_id: weiboId,
        content: content,
        }
        apiCommentAdd(form, function(comment) {
            insertCommentAddForm(comment, weiboCell)
        })
    } else {
        log('点到了 weibo cell')
    }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    var self = event.target
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了删除按钮')
        var comment_id = self.parentElement.dataset['commentid']
        apiCommentDelete(comment_id, function(r) {
            log('apiWeiboDelete', r.message)
            if (r.message === '权限不足') {
                alert(r.message)
            } else {
                self.parentElement.remove()
                alert(r.message)
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了编辑按钮', self)
        var commentCell = self.closest('.comment-cell')
        var weiboId = commentCell.dataset['id']
        var commentSpan = e('.comment-title', commentCell)
        var content = commentSpan.innerText
        insertCommentUpdateForm(content, commentCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentUpdate = function() {
    var weiboList = e('#id-weibo-list')
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    log(self.classList)
    if (self.classList.contains('comment-update')) {
        log('点到了删除按钮')
        var commentUpdateForm = self.closest('.comment-update-form')
        var commentCell = commentUpdateForm.closest('.comment-cell')
        log('234', commentCell)
        var commentId = commentCell.dataset['commentid']
        var commentInput = e('.comment-update-input', commentUpdateForm)
        var content =commentInput.value
        var form = {
            id: commentId,
            content: content,
        }

        apiCommentUpdate(form, function(comment) {
            // log('apiTodoUpdate', weibo)
            if (comment.message === undefined) {
                var commentSpan = e('.comment-title', commentCell)
                commentSpan.innerText = comment.content
                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
                alert('更新成功')
            } else {
                alert(comment.message)
            }
        })
    } else {
        log('点到了 comment cell12345')
    }
})}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
