#include "km0/device/boardIo.h"
#include "km0/device/digitalIo.h"
#include "km0/device/system.h"

//board ProMicro Pico
//GP25: onboard RGB LED

int main() {
  boardIo_setupLeds_proMicroRp();
  // boardIo_setupLeds_qtPyRp();
  // boardIo_setupLeds_tiny2040();
  while (true) {
    boardIo_writeLed1(true);
    delayMs(1);
    boardIo_writeLed2(false);
    delayMs(1000);
    boardIo_writeLed1(false);
    delayMs(1);
    boardIo_writeLed2(true);
    delayMs(1000);
  }
}
