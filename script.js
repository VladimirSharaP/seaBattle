var lengthShip;
var count;
var arrCellsNumbers = [];
var nameGamer;
var userXCoord = ['а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и', 'к'];
var userYCoord = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
for (var i = 0; i < 100; i++) arrCellsNumbers[i] = i;//создаем массив для ходов компьютера
// функция нанесения координат полей
function addTextPositioning(id) {
	for (var i = 0; i < 10; i++) {
		$('#' + id + 'YCoord').append('<span>' + userYCoord[i] + '</span>');
		$('#' + id + 'XCoord').append('<span>' + userXCoord[i] + '</span>');
	}
}
//по клику создается поле боя
$('#reload').click(function () {
	//очищаются левое и правое поля
	clearningField('#leftField');
	clearningField('#rightField');
	//блокировка нажатия во время чужого хода
	$('#leftField').append('<div id="leftFieldBlock"></div>');
	$('#rightField').append('<div id="rightFieldBlock"></div>');
	for (lengthShip = 4; lengthShip >= 1; lengthShip--) {
		for (count = (5 - lengthShip); count >= 1; count--) {
			//получается массив координат частей корабля
			var position = getCoordShip(lengthShip, '#leftField');
			var position2 = getCoordShip(lengthShip, '#rightField');
			//в цикле вызывается функция для размещения кораблей по частям
			for (var cells = 0; cells < position.length; cells++) {
				addShip(position[cells], '#leftField');
				addShip(position2[cells], '#rightField');
			}
		}
	}
	$('#leftFieldContainer p').text(userName);
	//пустые ячейки заполняются "водой"
	colorToField('#leftField');
	colorToField('#rightField');
	whoseShot(1);
});
// функция расстановки кораблей
// получает на вход номер ячейки и поле
function addShip(numberCell, field) {
	// массив ближайших ячеек для закрашивания водой
	var arrAround = [numberCell - 1, numberCell - 10, numberCell + 10, numberCell - 1 - 10, numberCell - 1 + 10, numberCell + 1, numberCell + 1 - 10, numberCell + 1 + 10];
	var lengthArrAround;
	if (Math.floor(numberCell % 10) < 9) lengthArrAround = arrAround.length;
	else lengthArrAround = arrAround.length - 3;//если справого края поля
	for (var i = 0; i < lengthArrAround; i++) {
		var cell = $(field + ' #cell' + arrAround[i]);
		cell.hasClass('shipColor') ? 0 : cell.removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
	}
	$(field + ' #cell' + numberCell).removeClass('shipColor waterColor cellColor fireColor').addClass('shipColor');
	$(field + ' #cell' + numberCell).addClass('ship');
};
//функция для получения позиции корабля в виде массива
//на вход подается количество палуб и поле
function getCoordShip(x, field) {
	var out = [];
	var direction = randomInteger(0, 1);
	out[0] = randomInteger(0, 99);
	if (direction) {
		if (out[0] % 10 > (10 - x)) {
			out[0] = Math.floor(out[0] / 10) * 10 + (10 - x);
		}
		for (i = 1; i < x; i++) {
			out[i] = out[i - 1] + 1;
		}
	}
	else {
		if (out[0] > (x * 10 - 1)) {
			out[0] = (x * 10 - 1) + Math.round(out[0] % 10);
		}
		for (i = 1; i < x; i++) {
			out[i] = out[i - 1] + 10;
		}
	}
	for (i = 0; i < x; i++) {
		if ($(field + ' #cell' + out[i]).hasClass('shipColor') ||
			$(field + ' #cell' + out[i]).hasClass('waterColor'))
			return getCoordShip(x, field);
	}
	return out;
};
// функция получает имя пользователя из инпута
function getName() {
	userName = $('input').val();
	$('#userName').toggle();
	$('#info').html('<p><h3 id="blinkText">' + userName + ', для начала игры нажмите "Старт"</h3></p>');
}
// функция выдает случайное целое число 
function randomInteger(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	rand = Math.floor(rand);
	return rand;
};
// функция заполняет поле элементами span
// на вход подается поле
function clearningField(field) {
	$(field).empty();
	for (var i = 0; i < 100; i++) {
		$(field).append('<span class="cell cellColor" id=cell' + i + '  oncontextmenu="setFlag(' + i + ');return false" ></span>');
	}
};
//функция вызывается при нажатии на ячейку и ставит флажок для обозначения ячейки куда не нужно стрелять
//получает на вход номер ячейки
function setFlag(i) {
	if ($('#rightField #cell' + i).hasClass('flagColor')) {
		$('#rightField #cell' + i).removeClass('flagColor');
		$('#rightField #cell' + i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
	}
	else if ($('#rightField #cell' + i).hasClass('waterColor')) {
		$('#rightField #cell' + i).addClass('flagColor');
	}
}
// функция выстрела игрока
function shot(cell, x) {
	if ($(cell).hasClass('flagColor')) { return false; }
	if (($(cell).hasClass('fireColor')) ||
		($(cell).hasClass('cellColor')) ||
		($(cell).hasClass('ship')) && ($(cell).parent('#rightField'))) {
	}
	else {
		computerShot();
	}
	if (x) {
		$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('fireColor');
	}
	else {
		$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('cellColor');
	}
	checkWinner();
}
// функция выстрела компьютера
function computerShot() {
	whoseShot(0);
	var i = randomInteger(0, arrCellsNumbers.length - 1);
	if (arguments[0] == 'boom') {
		i = arguments[1];
		if (Math.floor(i / 10) > 9) i = arguments[1] - 1;
	}
	// удаляется ячейка из массива
	arrCellsNumbers.splice(i, 1);
	var cell = '#leftField #cell' + arrCellsNumbers[i];
	if (randomInteger(0, 5) > $('select').val() && $(cell).hasClass('waterColor')) {
		cell = '#' + $('.shipColor:first').attr('id');
		arrCellsNumbers.splice(i, 1);
	}
	// задается задержка чтобы показать что противник думает
	setTimeout(function () {
		if ($(cell).hasClass('ship')) {
			$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('fireColor');
			computerShot('boom', i);
		}
		else {
			$(cell).removeClass('shipColor waterColor cellColor fireColor').addClass('cellColor');;
		}
		$('#leftFieldBlock').toggle();
		$('#rightFieldBlock').toggle();
		whoseShot(1);
	}, 400);
}
// функция отображения надписи чей ход 
// получает на вход true(ход игрока) или false(ход компьютера)
function whoseShot(x) {
	if (x) {
		$('#info').html("<p><h3>Ваш ход</h3></p>");
	}
	else {
		$('#info').html("<p><h3>Ход соперника</h3></p>");
		$('#leftFieldBlock').toggle();
		$('#rightFieldBlock').toggle();
	}
	checkWinner();
}

function checkWinner() {
	let comp = 0;
	gamer = 0;
	for (var i = 0; i < 100; i++) {
		if ($('#rightField #cell' + i).hasClass('fireColor')) gamer++;
		if ($('#leftField #cell' + i).hasClass('fireColor')) comp++;
	}
	if (gamer > 19 && comp < 20) {
		$('#info').html('<p><h3 id="blinkText">Игрок ' + name + ' победил!<br>Нажмите "Старт" для новой игры</h3></p>');
		colorToField(' ', true);
		$('#leftFieldBlock').show();
		$('#rightFieldBlock').show();
	}
	else if (gamer < 20 && comp > 19) {
		$('#info').html('<p><h3 id="blinkText">Компьютер победил!<br>Нажмите "Старт" для новой игры</h3></p>');
		colorToField(' ', true);
		$('#leftFieldBlock').show();
		$('#rightFieldBlock').show();
	}
}
// функция для изменения цвета ячеек
// на вход получает поле
function colorToField(field) {
	for (var i = 0; i < 100; i++) {
		if (arguments[1]) {
			if ($('#rightField #cell' + i).hasClass('ship') && ($('#rightField #cell' + i).hasClass('waterColor') || $('#rightField #cell' + i).hasClass('flagColor')))
				$('#rightField #cell' + i).removeClass('shipColor waterColor cellColor fireColor').addClass('shipColor');
			else if ($('#rightField #cell' + i).hasClass('fireColor')) { continue; }
			else if ($('#rightField #cell' + i).hasClass('cellColor')) { continue; }
			else {
				$('#rightField #cell' + i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');;
			}
		} else {
			if ($(field + ' #cell' + i).hasClass('cellColor')) {
				$(field + ' #cell' + i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');
			}
			if ($('#rightField #cell' + i).hasClass('ship')) {
				$('#rightField #cell' + i).removeClass('shipColor waterColor cellColor fireColor').addClass('waterColor');;
				$('#rightField #cell' + i).click(function () {
					shot(this, 1);
				});
			}
			else {
				$(field + ' #cell' + i).click(function () {
					shot(this, 0);
				});
			}
		}
	}
};

clearningField('#leftField');
clearningField('#rightField');
$('.cell').removeClass('cellColor');
addTextPositioning('user');
addTextPositioning('comp');