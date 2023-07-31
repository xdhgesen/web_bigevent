$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    //初始化富文本编辑器
    initEditor()

    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定要记得调用form.render()方法
                form.render()
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 592,
        // 指定预览区域
        preview: '.img-preview'
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    /* 更换裁剪图片 */
    $('#coverFile').on('change', function (e) {
        var files = e.target.files

        if (files.length === 0) {
            return layui.layer.msg('请选择封面图片')
        }

        var newFileURL = URL.createObjectURL(files[0])

        $image.cropper('destroy').attr('src', newFileURL).cropper(options);
    })

    //定义文章的发布状态
    var art_state = '已发布'

    //为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单默认提交行为
        e.preventDefault()
        //2.基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        //3.将文章的发布状态，存到fd中
        fd.append('state', art_state)
        //4.将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个画布
            width: 400,
            height: 200
        }).toBlob(function (blob) {
            // 将裁剪图片变为文件blob后的回调函数
            fd.append('cover_img', blob)
            publishArticle(fd)
        })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData格式的数据，必须加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})