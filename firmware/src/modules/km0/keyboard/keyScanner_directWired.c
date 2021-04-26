#include "keyScanner_directWired.h"
#include "km0/common/bitOperations.h"
#include "km0/deviceIo/dio.h"

static uint8_t numPins;
static const uint8_t *pins;

void keyScanner_directWired_initialize(uint8_t _numPins, const uint8_t *_pins) {
  numPins = _numPins;
  pins = _pins;
  for (uint8_t i = 0; i < numPins; i++) {
    dio_setInputPullup(pins[i]);
  }
}

void keyScanner_directWired_update(uint8_t *keyStateBitFlags) {
  for (uint8_t i = 0; i < numPins; i++) {
    uint8_t byteIndex = i >> 3;
    uint8_t bitIndex = i & 0x07;
    bool isDown = dio_read(pins[i]) == 0;
    bit_spec(keyStateBitFlags[byteIndex], bitIndex, isDown);
  }
}