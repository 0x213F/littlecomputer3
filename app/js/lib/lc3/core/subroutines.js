function Subroutines() {
  const add = function (inst) {
    // TODO
  }

  const and = function (inst) {
    // TODO
  }

  const not = function (inst) {
    // TODO
  }

  const br = function (inst) {
    // TODO
  }

  const st = function (inst) {
    // TODO
  }

  const ld = function (inst) {
    // TODO
  }

  const str = function (inst) {
    // TODO
  }

  const ldr = function (inst) {
    // TODO
  }

  const jmp = function (inst) {
    // TODO
  }

  const jsr = function (inst) {
    // TODO
  }

  const ldi = function (inst) {
    // TODO
  }

  const sti = function (inst) {
    // TODO
  }

  const lea = function (inst) {
    // TODO
  }

  const trap = function (inst) {
    // TODO
  }

  const rti = function (inst) {
    // TODO
  }

  const reserved = function (inst) {
    // TODO
  }

  const subroutines = {
    0x1: add,
    0x5: and,
    0x9: not,
    0x0: br,
    0x3: st,
    0x2: ld,
    0x7: str,
    0x6: ldr,
    0xC: jmp,
    0x4: jsr,
    0xA: ldi,
    0xB: sti,
    0xE: lea,
    0xF: trap,
    0x8: rti,
    0xD: reserved
  }
}

Subroutines.prototype.execute = function(bytes) {
  const opcode = bytes >> 12;
  subroutines[opcode](bytes);
};