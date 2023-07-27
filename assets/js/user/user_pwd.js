$(function () {
    var form = layui.form

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },

        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })


    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        var oldPwd = $(this).find('[name="oldPwd"]').val();
        var newPwd = $(this).find('[name="newPwd"]').val();
        var rePwd = $(this).find('[name="rePwd"]').val();


        // 构建自定义key-value对象
        var requestData = {
            old_pwd: oldPwd,
            new_pwd: newPwd,
            re_pwd: rePwd
            // 可以添加其他需要的参数
            // key: value
        };

        $.ajax({
            method: 'PATCH',
            url: '/my/updatepwd',
            data: requestData,
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})