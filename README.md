#Домашнее задание №10

1. задание (расположено в разделе `mvc-group`):
Взять за основу пример `MVС`. (первый commit - `initial state`)
Добавить вкладку `Группы`, при переходе на вкладку, должен отображаться список групп (лого и имена групп), в которых состоит пользователь

2. задание (расположено в разделе `mvc-photo/step1`):
Взять за основу пример `MVС`.
Добавить вкладку `Фото`, при переходе на вкладку, должны отображаться все фото пользователя с количеством лайков, репостов и комментариев каждого фото.

3. задание (со звездочкой - расположено в разделе `mvc-photo/step2`):
Взять за основу результат `ДЗ 2`. 
Во вкладке `Фото`, помимо количества лайков, репостов и комментариев, выводить комментарии к каждому фото. Если комментариев к какому-либо фото нет, то, рядом с соответствующим фото, выводить надпись: `К этому фото нет комментариев.`
Каждый комментарий - это фото автора, фио автора, дата комментария, текст комментария

4. задание (со большой звездочкой - расположено в разделе `mvc-photo/step3`):
Взять за основу результат `ДЗ 3`.
Вместо обычного списка всех фото, выводить фото, сгруппированные по альбомам, в которых они состоят.
Например:
Альбом1
фото1
фото2
фото3

Альбом2
фото1
фото2

И так далее…

5. задание (со очень большой звездочкой - расположено в разделе `mvc-photo/step4`):
Взять за основу результат `ДЗ 4`.
Добавить возможность выбирать сортировку фото в альбомах:
- по количеству комментариев
- по количеству репостов
- по количеству лайков
- по дате добавления

Сортировка должно происходить на стороне вашего приложения, а не при помощи ВКонтакте.
Верстка остается на ваше усмотрение.
______________

В разделах `mvc-photo/step*` перед запуском проекта необходимо собрать все модули из каталога `js` в один файл, который должен располагатся в следующем месте: `mvc-photo/step*/app`. Входная точка - `entry.js`, выходной файл должен называться `main.js`
Также необходимо установить шаблонизатор `Handlebars` для каждой части задания в разделе `mvc-photo`, запустив команду `npm i` в соответствующей директории (`step*`)