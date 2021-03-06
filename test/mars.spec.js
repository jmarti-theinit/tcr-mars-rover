const { DIRECTIONS } = require('../src/constants');
const { COMMANDS } = require('../src/commands');
const { OBSTACLES } = require('../src/obstacles');
const MarsRover = require('../src/mars');

describe('Mars Rover Kata', () => {
  describe('when constructing', () => {
    it('sets initial position', () => {
      const marsRover = new MarsRover({ x: 0, y: 0 }, DIRECTIONS.N, COMMANDS);

      expect(marsRover.x).to.equal(0);
      expect(marsRover.y).to.equal(0);
    });
    it('sets facing direction', () => {
      const marsRover = new MarsRover({ x: 0, y: 0 }, DIRECTIONS.N, COMMANDS);

      expect(marsRover.direction).to.equal(DIRECTIONS.N);
    });
  });
  describe('when moving', () => {
    const cases = [
      { pos: { x: 5, y: 5 }, dir: DIRECTIONS.N, command: 'f', expected: { x: 5, y: 6 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.N, command: 'f', expected: { x: 5, y: 5 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.S, command: 'f', expected: { x: 5, y: 3 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.W, command: 'f', expected: { x: 4, y: 4 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.E, command: 'f', expected: { x: 6, y: 4 } },
      { pos: { x: 5, y: 5 }, dir: DIRECTIONS.N, command: 'b', expected: { x: 5, y: 4 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.N, command: 'b', expected: { x: 5, y: 3 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.S, command: 'b', expected: { x: 5, y: 5 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.W, command: 'b', expected: { x: 6, y: 4 } },
      { pos: { x: 5, y: 4 }, dir: DIRECTIONS.E, command: 'b', expected: { x: 4, y: 4 } },

    ];
    cases.forEach((tcase) => {
      it(`executes commands - case ${tcase.pos.x}/${tcase.pos.y} / ${tcase.dir} / ${tcase.command}`, () => {
        const marsRover = new MarsRover({ x: tcase.pos.x, y: tcase.pos.y }, tcase.dir, COMMANDS);

        marsRover.execute([tcase.command]);

        expect(marsRover.x).to.equal(tcase.expected.x);
        expect(marsRover.y).to.equal(tcase.expected.y);
      });
    });
  });

  it('executes several commands', () => {
    const marsRover = new MarsRover({ x: 5, y: 5 }, DIRECTIONS.N, COMMANDS);

    marsRover.execute(['f','f']);

    expect(marsRover.y).to.equal(7);
  });

  describe('when turning', () => {
    const cases = [
      { dir: DIRECTIONS.N, command: 'l', expectedDir: DIRECTIONS.W },
      { dir: DIRECTIONS.W, command: 'l', expectedDir: DIRECTIONS.S },
      { dir: DIRECTIONS.S, command: 'l', expectedDir: DIRECTIONS.E },
      { dir: DIRECTIONS.E, command: 'l', expectedDir: DIRECTIONS.N },
      { dir: DIRECTIONS.N, command: 'r', expectedDir: DIRECTIONS.E },
      { dir: DIRECTIONS.W, command: 'r', expectedDir: DIRECTIONS.N },
      { dir: DIRECTIONS.S, command: 'r', expectedDir: DIRECTIONS.W },
      { dir: DIRECTIONS.E, command: 'r', expectedDir: DIRECTIONS.S },
    ];
    cases.forEach((tcase) => {
      it(`executes turn - case ${tcase.dir} / ${tcase.command}`, () => {
        const marsRover = new MarsRover({ x: 5, y: 5 }, tcase.dir, COMMANDS);

        marsRover.execute([tcase.command]);

        expect(marsRover.direction).to.equal(tcase.expectedDir);
      });
    });
  });

  describe('when moving off the grid', () => {
    it('shows in the other side horizontally', () => {
      const marsRover = new MarsRover({ x: 10, y: 5 }, DIRECTIONS.E, COMMANDS);

      marsRover.execute(['f', 'f']);

      expect(marsRover.x).to.equal(1);
    });

    it('shows in the other side vertically', () => {
      const marsRover = new MarsRover({ x: 5, y: 10 }, DIRECTIONS.N, COMMANDS);

      marsRover.execute(['f', 'f']);

      expect(marsRover.y).to.equal(1);
    });
  });

  describe('obstacle detection', () => {
    it('initializes with obstacles', () => {
      const marsRover = new MarsRover({ x: 5, y: 10 }, DIRECTIONS.N, COMMANDS, OBSTACLES);

      expect(marsRover.obstacles).to.eql(OBSTACLES);
    });

    it('throws error when obstacle found', () => {
      const marsRover = new MarsRover({ x: 3, y: 9 }, DIRECTIONS.N, COMMANDS, [
        {x: 3, y: 10}
      ]);

      expect(() => {
        marsRover.execute(['f', 'f']);
      }).to.throw();
    });

    it('throws error when obstacle found - case 2', () => {
      const marsRover = new MarsRover({ x: 2, y: 7 }, DIRECTIONS.N, COMMANDS, [
        {x: 3, y: 10},
        {x: 2, y: 8},
      ]);

      expect(() => {
        marsRover.execute(['f', 'f']);
      }).to.throw();
    });

    it('moves until last point', () => {
      const marsRover = new MarsRover({ x: 2, y: 6 }, DIRECTIONS.N, COMMANDS, [
        {x: 3, y: 10},
        {x: 2, y: 8},
      ]);

      expect(() => {
        marsRover.execute(['f', 'f', 'f']);
      }).to.throw();

      expect(marsRover.x).to.equal(2);
      expect(marsRover.y).to.equal(7);
    });
  });
});