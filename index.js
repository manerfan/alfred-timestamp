'use strict';

const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');

const moment = require('moment');

const sdf = 'YYYY-MM-DD HH:mm:ss';

// Checks for available update and updates the `info.plist`
alfredNotifier();

(async () => {
    try {
        const items = await new Promise((resolve, reject) => {
            let input = (alfy.input || '').trim();
            if (input.length < 1) {
                input = moment().format(sdf);
            }

            if (/^\d+$/.test(input)) {
                // 纯数字，作为timestamp使用
                const timestamp = moment(parseInt(input)).format(sdf);
                resolve([{
                    title: timestamp,
                    subtitle: input,
                    arg: timestamp,
                    icon: {
                        path: './icon/time.png'
                    }
                }]);
            } else if (/^\d{4}-\d{2}-\d{2}( \d{2}(:\d{2}(:\d{2})?)?)?$/.test(input)) {
                // 作为格式化日期使用
                const date = moment(input).toDate().getTime();
                resolve([{
                    title: date,
                    subtitle: input,
                    arg: date,
                    icon: {
                        path: './icon/date.png'
                    }
                }]);
            } else {
                // 格式不正确
                resolve([{
                    title: input,
                    subtitle: `请输入日期(2018-12-10 12:00:00)或时间戳(1544414400000)`,
                    arg: input,
                    icon: {
                        path: 'icon.png'
                    }
                }]);
            }
        });

        alfy.output(items.map(item => Object.assign({}, item, {
            mods: {
                cmd: {
                    subtitle: `按Command弹出`
                }
            }
        })));
    } catch (ex) {
        alfy.output([{
            title: '哎呀~小师妹并不清楚您想要转换的内容~',
            subtitle: ex.messsage,
            arg: alfy.input,
            icon: {
                path: './icon/error.png'
            }
        }]);
    }
})();
