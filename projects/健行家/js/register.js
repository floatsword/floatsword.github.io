(function($) {
    $(function() {
        $(function() {  //validate
            var PIN, validateCache = {
                textUsername: false,
                textUserPsd1: false,
                textUserPsd2: false,
                expShop     : false,
                textPIN     : false,
                cbxAgree    : false
            };
            $('#textUsername').on('blur', function(event) {
                var regExp = /^[a-zA-z]\w{3,19}$/;    //用户名验证
                validateCache[this.id] = validate(regExp, this);
            });

            $('#textUserPsd1').on('blur', function(event) {
                var regExp = /^\w{6,20}$/;            //密码验证
                validateCache[this.id] = validate(regExp, this);
            })

            $('#textUserPsd2').on('blur', function(event) {
                var psd1 = $('#textUserPsd1').val();  //确认密码
                var val = $(this).val();

                if (val !== psd1 || !psd1) {
                    validateCache[this.id] = validate('', this)(false, '两次密码不一致！请检查后重新输入')
                } else {
                    validateCache[this.id] = validate('', this)(true)
                    var regExp = /^\w{6,20}$/;
                    validate(regExp, this);
                }
                console.log(validateCache[this.id] );

            })

            $('#expShop').on('change', function() { //下拉框

                validateCache[this.id] = validate('', this)(Number($(this).val()) ? true : false)
            })

            $('#getPIN').on('click', function(event) { //验证码
                var regExp = /^1[3|4|5|8][0-9]\d{4,8}$/;
                var textUserPhone = $('#textUserPhone');

                validate(regExp, textUserPhone) && (PIN = parseInt(Math.random()*8998 + 1001)) && alert('您得到的验证码是:' + PIN);;

            })

            $('#textPIN').on('blur', function() {      //检测验证码
                validateCache[this.id] = Number($(this).val()) === PIN;
                validate('',this)(validateCache[this.id]);
            });

            $('#cbxAgree').on('click', function() {
                validateCache[this.id] = $(this).prop('checked');
            })

            $('#submitReg').on('click', function() {
                var mistakes = {};
                for (var attr in validateCache) {
                    if (validateCache.hasOwnProperty(attr)) {
                        if (!validateCache[attr]) {
                            mistakes[attr] = validateCache[attr]
                        }
                    }
                }
                if ($.isEmptyObject(mistakes)) {
                    alert('注册成功');
                    return;
                } else {
                    for (var attr in mistakes) {
                        $('#'+attr).addClass('miss')
                    }
                }
            })

            function validate(regExp, ctx) {
                var val = $(ctx).val();
                var tips = $(ctx).parent().find('.validate');
                var textDesc = $(ctx).parent().find('.text_desc');
                var text = textDesc.text();

                return regExp ? changeState(regExp.test(val)) : changeState



                function changeState(state, desc) {
                    var desc = desc  ? desc : text;

                    if (typeof state === 'boolean' && state) {
                        $(ctx).removeClass('miss');
                        tips.text('').removeClass('wrong').addClass('ok');
                        textDesc && textDesc.hide();

                    } else if (typeof state === 'boolean' && !state) {
                        tips.text('').removeClass('ok').addClass('wrong');
                        textDesc && textDesc.text(desc).show();
                    }
                    return state;
                }
            }
        })
    })


})(jQuery);
