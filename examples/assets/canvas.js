let canvas;
let ctx;

function canvasStart() {
	canvas = document.getElementById('test-canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx = canvas.getContext('2d');

	draw();
}

let ball = {
	r: 50,
	pos: {
		x: 100,
		y: 100
		},
	vel: {
		x: 15,
		y: 6
		},
	};

function draw(){
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// draw ball
	ctx.beginPath();
	ctx.arc(ball.pos.x, ball.pos.y, ball.r, 0, 2*Math.PI);
	ctx.fill();

	ball.pos.x += ball.vel.x;
	ball.pos.y += ball.vel.y;

	if (ball.pos.y > canvas.height - ball.r)
		ball.vel.y = -Math.abs(ball.vel.y);
	if (ball.pos.y < ball.r)
		ball.vel.y = Math.abs(ball.vel.y);
	if (ball.pos.x < ball.r)
		ball.vel.x = Math.abs(ball.vel.x);
	if (ball.pos.x > canvas.width - ball.r)
		ball.vel.x = -Math.abs(ball.vel.x);
}

window.addEventListener('resize', function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
