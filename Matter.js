document.addEventListener("DOMContentLoaded", () => {
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create();
    const world = engine.world;

    const canvas = document.getElementById("arkanoidCanvas");
    const ctx = canvas.getContext("2d");

    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: 480,
            height: 320,
            wireframes: false,
            background: '#000'
        }
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    // Paddle
    const paddle = Bodies.rectangle(240, 310, 75, 10, { isStatic: true });
    Composite.add(world, paddle);

    // Ball
    const ball = Bodies.circle(240, 150, 10, { restitution: 1, friction: 0, frictionAir: 0 });
    Composite.add(world, ball);

    // Bricks
    const brickWidth = 75;
    const brickHeight = 20;
    const bricks = [];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            const brick = Bodies.rectangle(30 + i * (brickWidth + 10), 30 + j * (brickHeight + 10), brickWidth, brickHeight, { isStatic: true });
            bricks.push(brick);
            Composite.add(world, brick);
        }
    }

    // Walls
    const walls = [
        Bodies.rectangle(240, 0, 480, 20, { isStatic: true }), // top
        Bodies.rectangle(0, 160, 20, 320, { isStatic: true }), // left
        Bodies.rectangle(480, 160, 20, 320, { isStatic: true }) // right
    ];
    Composite.add(world, walls);

    // Mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    Composite.add(world, mouseConstraint);

    // Update paddle position based on mouse movement
    Events.on(mouseConstraint, 'mousemove', function(event) {
        const relativeX = event.mouse.absolute.x;
        if (relativeX > 0 && relativeX < canvas.width) {
            Matter.Body.setPosition(paddle, { x: relativeX, y: 310 });
        }
    });

    // Collision detection
    Events.on(engine, 'collisionStart', function(event) {
        event.pairs.forEach(pair => {
            const { bodyA, bodyB } = pair;
            if (bricks.includes(bodyA) || bricks.includes(bodyB)) {
                Composite.remove(world, bodyA === ball ? bodyB : bodyA);
            }
        });
    });

    // Start the game
    Matter.Body.setVelocity(ball, { x: 5, y: 5 });
});
